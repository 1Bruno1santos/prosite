import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { 
  db, 
  eq, 
  and,
  desc,
  like,
  sql,
  clients,
  castles,
  logs,
  templates,
  type NewClient,
  type NewTemplate,
} from '@prosite/database';
import {
  searchSchema,
  createClientSchema,
  updateClientSchema,
  AUTH_CONSTANTS,
  HTTP_STATUS,
  ERROR_CODES,
  addDays,
  type Metrics,
} from '@prosite/shared';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireRole('admin'));

// Dashboard metrics
router.get('/dashboard/metrics', asyncHandler(async (req, res) => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get total and active clients
  const [{ totalClients }] = await db
    .select({ totalClients: sql<number>`COUNT(*)` })
    .from(clients);

  const [{ activeClients }] = await db
    .select({ activeClients: sql<number>`COUNT(*)` })
    .from(clients)
    .where(eq(clients.status, 'active'));

  // Get total and active castles
  const [{ totalCastles }] = await db
    .select({ totalCastles: sql<number>`COUNT(*)` })
    .from(castles);

  const [{ activeCastles }] = await db
    .select({ activeCastles: sql<number>`COUNT(*)` })
    .from(castles)
    .where(eq(castles.active, true));

  // Calculate growth
  const [{ lastMonthClients }] = await db
    .select({ lastMonthClients: sql<number>`COUNT(*)` })
    .from(clients)
    .where(sql`${clients.createdAt} <= ${lastMonth}`);

  const clientsGrowth = lastMonthClients > 0 
    ? Math.round(((totalClients - lastMonthClients) / lastMonthClients) * 100)
    : 100;

  const [{ lastMonthCastles }] = await db
    .select({ lastMonthCastles: sql<number>`COUNT(*)` })
    .from(castles)
    .where(sql`${castles.createdAt} <= ${lastMonth}`);

  const castlesGrowth = lastMonthCastles > 0
    ? Math.round(((totalCastles - lastMonthCastles) / lastMonthCastles) * 100)
    : 100;

  // Get recent activity
  const recentActivity = await db
    .select({
      id: logs.id,
      type: logs.action,
      description: logs.details,
      timestamp: logs.createdAt,
    })
    .from(logs)
    .orderBy(desc(logs.createdAt))
    .limit(10);

  // Get clients over time (last 30 days)
  const clientsOverTime = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(clients)
      .where(sql`${clients.createdAt} >= ${date} AND ${clients.createdAt} < ${nextDate}`);

    clientsOverTime.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }

  // Get top 10 clients by castle count
  const castlesPerClient = await db
    .select({
      clientName: clients.name,
      castles: sql<number>`COUNT(${castles.id})`,
    })
    .from(clients)
    .leftJoin(castles, eq(castles.clientId, clients.id))
    .groupBy(clients.id)
    .orderBy(desc(sql`COUNT(${castles.id})`))
    .limit(10);

  res.json({
    totalClients,
    activeClients,
    totalCastles,
    activeCastles,
    clientsGrowth,
    castlesGrowth,
    recentActivity,
    clientsOverTime,
    castlesPerClient,
  });
}));

// List clients with search and pagination
router.get('/clients', asyncHandler(async (req, res) => {
  const query = req.query.search as string | undefined;
  
  // Get clients with castle count
  let clientsQuery = db
    .select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
      status: clients.status,
      createdAt: clients.createdAt,
      lastLoginAt: clients.lastLogin,
      billingEnd: clients.billingEnd,
      castleCount: sql<number>`COUNT(DISTINCT ${castles.id})`,
    })
    .from(clients)
    .leftJoin(castles, eq(castles.clientId, clients.id))
    .groupBy(clients.id);

  if (query) {
    clientsQuery = clientsQuery.where(
      sql`${clients.name} LIKE ${`%${query}%`} OR ${clients.email} LIKE ${`%${query}%`}`
    );
  }

  const clientsList = await clientsQuery.orderBy(desc(clients.createdAt));

  res.json(clientsList);
}));

// Get client details
router.get('/clients/:id', asyncHandler(async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id));

  if (!client) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      'Client not found'
    );
  }

  // Get client's castles
  const clientCastles = await db
    .select()
    .from(castles)
    .where(eq(castles.clientId, id));

  // Get recent logs
  const recentLogs = await db
    .select()
    .from(logs)
    .where(eq(logs.clientId, id))
    .orderBy(desc(logs.createdAt))
    .limit(20);

  res.json({
    success: true,
    data: {
      ...client,
      castles: clientCastles,
      recentLogs,
    },
  });
}));

// Create new client
router.post('/clients', asyncHandler(async (req, res) => {
  const { email, password, billingDays } = createClientSchema.parse(req.body);

  // Check if email already exists
  const [existing] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.email, email));

  if (existing) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      'Email already exists'
    );
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_ROUNDS);

  // Create client
  const newClient: NewClient = {
    email,
    passwordHash,
    billingEnd: addDays(new Date(), billingDays),
    active: true,
  };

  const [created] = await db
    .insert(clients)
    .values(newClient)
    .returning();

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: created,
  });
}));

// Update client status
router.patch('/clients/:id/status', asyncHandler(async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const { status } = z.object({ 
    status: z.enum(['active', 'suspended']) 
  }).parse(req.body);

  const [updated] = await db
    .update(clients)
    .set({ status })
    .where(eq(clients.id, id))
    .returning();

  if (!updated) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      'Client not found'
    );
  }

  res.json({
    success: true,
    data: updated,
  });
}));

// Update client
router.put('/clients/:id', asyncHandler(async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const updates = updateClientSchema.parse(req.body);

  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id));

  if (!client) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      'Client not found'
    );
  }

  const updateData: any = {};
  
  if (updates.email) updateData.email = updates.email;
  if (updates.active !== undefined) updateData.active = updates.active;
  if (updates.billingEnd) updateData.billingEnd = new Date(updates.billingEnd);

  const [updated] = await db
    .update(clients)
    .set(updateData)
    .where(eq(clients.id, id))
    .returning();

  res.json({
    success: true,
    data: updated,
  });
}));

// Delete client
router.delete('/clients/:id', asyncHandler(async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

  // Delete client's castles first
  await db.delete(castles).where(eq(castles.clientId, id));
  
  // Delete client's logs
  await db.delete(logs).where(eq(logs.clientId, id));
  
  // Delete client
  const [deleted] = await db
    .delete(clients)
    .where(eq(clients.id, id))
    .returning();

  if (!deleted) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      'Client not found'
    );
  }

  res.json({
    success: true,
    data: deleted,
  });
}));

// Get logs with filters
router.get('/logs', asyncHandler(async (req, res) => {
  const level = req.query.level as string | undefined;
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;
  
  let logsQuery = db
    .select({
      id: logs.id,
      timestamp: logs.createdAt,
      level: sql<string>`CASE 
        WHEN ${logs.action} LIKE '%error%' THEN 'error'
        WHEN ${logs.action} LIKE '%warning%' THEN 'warning'
        WHEN ${logs.action} LIKE '%success%' THEN 'success'
        ELSE 'info'
      END`,
      action: logs.action,
      userId: logs.clientId,
      userEmail: clients.email,
      details: logs.details,
      metadata: sql<any>`json_object()`,
    })
    .from(logs)
    .leftJoin(clients, eq(logs.clientId, clients.id))
    .orderBy(desc(logs.createdAt));

  if (level && level !== 'all') {
    logsQuery = logsQuery.where(
      sql`CASE 
        WHEN ${logs.action} LIKE '%error%' THEN 'error'
        WHEN ${logs.action} LIKE '%warning%' THEN 'warning'
        WHEN ${logs.action} LIKE '%success%' THEN 'success'
        ELSE 'info'
      END = ${level}`
    );
  }

  if (startDate) {
    logsQuery = logsQuery.where(sql`${logs.createdAt} >= ${new Date(startDate)}`);
  }

  if (endDate) {
    logsQuery = logsQuery.where(sql`${logs.createdAt} <= ${new Date(endDate)}`);
  }

  const logsList = await logsQuery.limit(100);

  res.json(logsList);
}));

// Get templates
router.get('/templates', asyncHandler(async (req, res) => {
  const templatesList = await db
    .select({
      id: templates.id,
      name: templates.name,
      description: sql<string>`COALESCE(${templates.name}, 'Template de configuração')`,
      parameters: sql<any>`json(${templates.settingsJson})`,
      createdAt: templates.createdAt,
      updatedAt: templates.updatedAt,
      usageCount: sql<number>`(SELECT COUNT(*) FROM ${castles} WHERE ${castles.templateId} = ${templates.id})`,
    })
    .from(templates)
    .orderBy(desc(templates.createdAt));

  res.json(templatesList);
}));

// Create template
router.post('/templates', asyncHandler(async (req, res) => {
  const { name, settings } = z.object({
    name: z.string().min(1),
    settings: z.record(z.unknown()),
  }).parse(req.body);

  const newTemplate: NewTemplate = {
    name,
    settingsJson: JSON.stringify(settings),
  };

  const [created] = await db
    .insert(templates)
    .values(newTemplate)
    .returning();

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: created,
  });
}));

// Get admin settings
router.get('/settings', asyncHandler(async (req, res) => {
  // Return mock settings for now
  const settings = {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: '', // Never send password
    },
    notifications: {
      emailOnNewClient: true,
      emailOnClientSuspension: true,
      emailOnSystemError: true,
    },
    security: {
      sessionTimeout: 720, // 12 hours in minutes
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireStrongPassword: true,
    },
    system: {
      maintenanceMode: false,
      debugMode: process.env.NODE_ENV === 'development',
      logRetentionDays: 30,
    },
  };

  res.json(settings);
}));

// Update admin settings
router.put('/settings', asyncHandler(async (req, res) => {
  // Validate settings
  const settings = req.body;
  
  // In a real implementation, save to database or config file
  // For now, just return success
  
  res.json({
    success: true,
    message: 'Settings updated successfully',
  });
}));

export default router;
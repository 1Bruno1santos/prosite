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
router.get('/metrics', asyncHandler(async (req, res) => {
  const now = new Date();
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
  const lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get metrics
  const [{ activeClients }] = await db
    .select({ activeClients: sql<number>`COUNT(*)` })
    .from(clients)
    .where(eq(clients.active, true));

  const [{ totalCastles }] = await db
    .select({ totalCastles: sql<number>`COUNT(*)` })
    .from(castles);

  const [{ changesLastHour }] = await db
    .select({ changesLastHour: sql<number>`COUNT(*)` })
    .from(logs)
    .where(sql`${logs.createdAt} >= ${lastHour}`);

  const [{ changesLastDay }] = await db
    .select({ changesLastDay: sql<number>`COUNT(*)` })
    .from(logs)
    .where(sql`${logs.createdAt} >= ${lastDay}`);

  const [{ changesLastWeek }] = await db
    .select({ changesLastWeek: sql<number>`COUNT(*)` })
    .from(logs)
    .where(sql`${logs.createdAt} >= ${lastWeek}`);

  const metrics: Metrics = {
    activeClients,
    totalCastles,
    changesLastHour,
    changesLastDay,
    changesLastWeek,
    averageResponseTime: 0, // TODO: Implement response time tracking
  };

  res.json({
    success: true,
    data: metrics,
  });
}));

// List clients with search and pagination
router.get('/clients', asyncHandler(async (req, res) => {
  const { query, page, pageSize, sortBy = 'createdAt', sortOrder } = searchSchema.parse(req.query);
  
  const offset = (page - 1) * pageSize;
  
  let baseQuery = db.select().from(clients);
  
  if (query) {
    baseQuery = baseQuery.where(like(clients.email, `%${query}%`));
  }
  
  // TODO: Add proper sorting
  const clientsList = await baseQuery
    .orderBy(desc(clients.createdAt))
    .limit(pageSize)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(clients)
    .where(query ? like(clients.email, `%${query}%`) : undefined);

  res.json({
    success: true,
    data: {
      items: clientsList,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
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

// Get logs with filters
router.get('/logs', asyncHandler(async (req, res) => {
  const { query, page, pageSize } = searchSchema.parse(req.query);
  
  const offset = (page - 1) * pageSize;
  
  // TODO: Add proper filtering
  const logsList = await db
    .select({
      log: logs,
      clientEmail: clients.email,
      castleName: castles.name,
    })
    .from(logs)
    .innerJoin(clients, eq(logs.clientId, clients.id))
    .innerJoin(castles, eq(logs.castleId, castles.id))
    .orderBy(desc(logs.createdAt))
    .limit(pageSize)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(logs);

  res.json({
    success: true,
    data: {
      items: logsList,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}));

// Get templates
router.get('/templates', asyncHandler(async (req, res) => {
  const templatesList = await db
    .select()
    .from(templates)
    .orderBy(desc(templates.createdAt));

  res.json({
    success: true,
    data: templatesList,
  });
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

export default router;
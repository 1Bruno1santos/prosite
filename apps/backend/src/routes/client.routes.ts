import { Router } from 'express';
import { z } from 'zod';
import { 
  db, 
  eq, 
  and,
  castles, 
  logs,
  type NewLog
} from '@prosite/database';
import {
  castleSettingsSchema,
  HTTP_STATUS,
  ERROR_CODES,
  type CastleSettings,
} from '@prosite/shared';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { windowsService } from '../services/windows.service.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);
router.use(requireRole('client'));

// Get all castles for authenticated client
router.get('/', asyncHandler(async (req, res) => {
  const clientCastles = await db
    .select({
      id: castles.id,
      name: castles.name,
      updatedAt: castles.updatedAt,
    })
    .from(castles)
    .where(eq(castles.clientId, req.user!.userId));

  res.json({
    success: true,
    data: clientCastles,
  });
}));

// Get castle details
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

  const [castle] = await db
    .select()
    .from(castles)
    .where(and(
      eq(castles.id, id),
      eq(castles.clientId, req.user!.userId)
    ));

  if (!castle) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      'Castle not found'
    );
  }

  // Parse settings JSON
  const settings = JSON.parse(castle.settingsJson) as CastleSettings;

  res.json({
    success: true,
    data: {
      id: castle.id,
      name: castle.name,
      settings,
      updatedAt: castle.updatedAt,
    },
  });
}));

// Update castle settings
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const newSettings = castleSettingsSchema.parse(req.body);

  // Get current castle
  const [castle] = await db
    .select()
    .from(castles)
    .where(and(
      eq(castles.id, id),
      eq(castles.clientId, req.user!.userId)
    ));

  if (!castle) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      'Castle not found'
    );
  }

  // Parse current settings
  const currentSettings = JSON.parse(castle.settingsJson) as CastleSettings;

  // Create log entries for changes
  const logEntries: NewLog[] = [];
  for (const [key, newValue] of Object.entries(newSettings)) {
    if (currentSettings[key] !== newValue) {
      logEntries.push({
        clientId: req.user!.userId,
        castleId: id,
        field: key,
        oldValue: JSON.stringify(currentSettings[key]),
        newValue: JSON.stringify(newValue),
      });
    }
  }

  // Update castle settings
  const settingsJson = JSON.stringify(newSettings);
  await db
    .update(castles)
    .set({ 
      settingsJson,
      updatedAt: new Date(),
    })
    .where(eq(castles.id, id));

  // Insert logs
  if (logEntries.length > 0) {
    await db.insert(logs).values(logEntries);
  }

  // Call Windows Service API
  try {
    await windowsService.updateCastle(id, newSettings);
  } catch (error) {
    // Log error but don't fail the request
    console.error('Failed to update Windows service:', error);
  }

  res.json({
    success: true,
    message: 'Castle settings updated successfully',
  });
}));

// Get castle logs
router.get('/:id/logs', asyncHandler(async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const { page = 1, pageSize = 20 } = req.query;

  // Verify castle ownership
  const [castle] = await db
    .select({ id: castles.id })
    .from(castles)
    .where(and(
      eq(castles.id, id),
      eq(castles.clientId, req.user!.userId)
    ));

  if (!castle) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.RESOURCE_NOT_FOUND,
      'Castle not found'
    );
  }

  // Get logs with pagination
  const offset = (Number(page) - 1) * Number(pageSize);
  const castleLogs = await db
    .select()
    .from(logs)
    .where(eq(logs.castleId, id))
    .orderBy(logs.createdAt)
    .limit(Number(pageSize))
    .offset(offset);

  res.json({
    success: true,
    data: castleLogs,
  });
}));

export default router;
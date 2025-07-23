import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS, ERROR_CODES } from '@prosite/shared';
import { db, eq, clients, adminUsers } from '@prosite/database';
import { config } from '../config/index.js';
import { AppError } from './errorHandler.js';

interface JwtPayload {
  userId: string;
  email: string;
  userType: 'client' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_INVALID,
        'Access token required'
      );
    }

    const payload = jwt.verify(token, config.jwtAccessSecret) as JwtPayload;
    
    // Verify user still exists and is active
    if (payload.userType === 'client') {
      const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, payload.userId));
      
      if (!client) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.TOKEN_INVALID,
          'User not found'
        );
      }
      
      if (!client.active) {
        throw new AppError(
          HTTP_STATUS.FORBIDDEN,
          ERROR_CODES.USER_INACTIVE,
          'Account is inactive'
        );
      }
    }

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_EXPIRED,
        'Access token expired'
      ));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_INVALID,
        'Invalid access token'
      ));
    } else {
      next(error);
    }
  }
}

export function requireRole(role: 'client' | 'admin') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_INVALID,
        'Authentication required'
      ));
      return;
    }

    if (req.user.userType !== role) {
      next(new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.PERMISSION_DENIED,
        'Insufficient permissions'
      ));
      return;
    }

    next();
  };
}
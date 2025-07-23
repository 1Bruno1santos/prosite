import { Router } from 'express';
import { z } from 'zod';
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  HTTP_STATUS,
} from '@prosite/shared';
import { authService } from '../services/auth.service.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Client login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const tokens = await authService.login(email, password, 'client');
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: tokens,
  });
}));

// Admin login
router.post('/admin/login', asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const tokens = await authService.login(email, password, 'admin');
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: tokens,
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = z.object({
    refreshToken: z.string(),
  }).parse(req.body);
  
  const tokens = await authService.refreshToken(refreshToken);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: tokens,
  });
}));

// Forgot password
router.post('/forgot', rateLimiter.passwordReset, asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);
  const userType = req.path.includes('admin') ? 'admin' : 'client';
  
  await authService.forgotPassword(email, userType);
  
  res.status(HTTP_STATUS.ACCEPTED).json({
    success: true,
    message: 'If the email exists, a reset link will be sent',
  });
}));

// Reset password
router.post('/reset', asyncHandler(async (req, res) => {
  const { token, newPassword } = resetPasswordSchema.parse(req.body);
  
  await authService.resetPassword(token, newPassword);
  
  res.status(HTTP_STATUS.NO_CONTENT).send();
}));

// Logout
router.post('/logout', asyncHandler(async (req, res) => {
  const { refreshToken } = z.object({
    refreshToken: z.string().optional(),
  }).parse(req.body);
  
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
}));

export default router;
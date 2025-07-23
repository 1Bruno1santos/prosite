import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  db, 
  eq, 
  clients, 
  adminUsers, 
  refreshTokens, 
  passwordResetTokens,
  type NewRefreshToken,
  type NewPasswordResetToken
} from '@prosite/database';
import { 
  AUTH_CONSTANTS, 
  type AuthTokens,
  generateRandomToken,
  sanitizeEmail,
  addDays
} from '@prosite/shared';
import { config } from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { HTTP_STATUS, ERROR_CODES } from '@prosite/shared';

interface JwtPayload {
  userId: string;
  email: string;
  userType: 'client' | 'admin';
}

export class AuthService {
  async login(email: string, password: string, userType: 'client' | 'admin'): Promise<AuthTokens> {
    const normalizedEmail = sanitizeEmail(email);
    
    // Get user based on type
    const table = userType === 'client' ? clients : adminUsers;
    const [user] = await db
      .select()
      .from(table)
      .where(eq(table.email, normalizedEmail));

    if (!user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_CREDENTIALS,
        'Invalid email or password'
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_CREDENTIALS,
        'Invalid email or password'
      );
    }

    // Check if client is active
    if (userType === 'client' && !user.active) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.USER_INACTIVE,
        'Account is inactive'
      );
    }

    // Update last login
    await db
      .update(table)
      .set({ lastLogin: new Date() })
      .where(eq(table.id, user.id));

    // Generate tokens
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      userType,
    };

    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = generateRandomToken(64);
    const refreshTokenData: NewRefreshToken = {
      token: refreshToken,
      userId: user.id,
      userType,
      expiresAt: addDays(new Date(), 30),
    };

    await db.insert(refreshTokens).values(refreshTokenData);

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    // Find and validate refresh token
    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token));

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_INVALID,
        'Invalid or expired refresh token'
      );
    }

    // Get user
    const table = storedToken.userType === 'client' ? clients : adminUsers;
    const [user] = await db
      .select()
      .from(table)
      .where(eq(table.id, storedToken.userId));

    if (!user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_INVALID,
        'User not found'
      );
    }

    // Check if client is active
    if (storedToken.userType === 'client' && !user.active) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.USER_INACTIVE,
        'Account is inactive'
      );
    }

    // Delete old refresh token
    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.id, storedToken.id));

    // Generate new tokens
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      userType: storedToken.userType,
    };

    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
    });

    const newRefreshToken = generateRandomToken(64);
    const refreshTokenData: NewRefreshToken = {
      token: newRefreshToken,
      userId: user.id,
      userType: storedToken.userType,
      expiresAt: addDays(new Date(), 30),
    };

    await db.insert(refreshTokens).values(refreshTokenData);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async forgotPassword(email: string, userType: 'client' | 'admin'): Promise<void> {
    const normalizedEmail = sanitizeEmail(email);
    
    // Check if user exists
    const table = userType === 'client' ? clients : adminUsers;
    const [user] = await db
      .select()
      .from(table)
      .where(eq(table.email, normalizedEmail));

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const resetToken = generateRandomToken(32);
    const tokenData: NewPasswordResetToken = {
      token: resetToken,
      email: normalizedEmail,
      userType,
      expiresAt: new Date(Date.now() + AUTH_CONSTANTS.PASSWORD_RESET_EXPIRY),
      used: false,
    };

    await db.insert(passwordResetTokens).values(tokenData);

    // TODO: Send email with reset link
    // For now, just log the token
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find and validate token
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.TOKEN_INVALID,
        'Invalid or expired reset token'
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, AUTH_CONSTANTS.BCRYPT_ROUNDS);

    // Update password
    const table = resetToken.userType === 'client' ? clients : adminUsers;
    await db
      .update(table)
      .set({ passwordHash })
      .where(eq(table.email, resetToken.email));

    // Mark token as used
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, resetToken.id));
  }

  async logout(refreshToken: string): Promise<void> {
    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.token, refreshToken));
  }
}

export const authService = new AuthService();
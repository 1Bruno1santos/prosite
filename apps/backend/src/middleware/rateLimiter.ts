import rateLimit from 'express-rate-limit';
import { RATE_LIMITS, HTTP_STATUS, ERROR_CODES } from '@prosite/shared';

const createLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        error: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: 'Too many requests, please try again later',
      });
    },
  });
};

export const rateLimiter = {
  default: createLimiter(60 * 1000, RATE_LIMITS.DEFAULT), // 100 requests per minute
  auth: createLimiter(60 * 1000, RATE_LIMITS.AUTH), // 10 auth attempts per minute
  passwordReset: createLimiter(60 * 60 * 1000, RATE_LIMITS.PASSWORD_RESET), // 3 reset requests per hour
};
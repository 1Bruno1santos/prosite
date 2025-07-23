import { z } from 'zod';

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3001),
  databaseUrl: z.string(),
  jwtAccessSecret: z.string().min(32),
  jwtRefreshSecret: z.string().min(32),
  smtpHost: z.string(),
  smtpPort: z.coerce.number(),
  smtpUser: z.string(),
  smtpPass: z.string(),
  smtpFrom: z.string().email(),
  windowsServiceUrl: z.string().url(),
  windowsServiceApiKey: z.string(),
  frontendUrl: z.string().url(),
  adminUrl: z.string().url(),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const envConfig = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM,
  windowsServiceUrl: process.env.WINDOWS_SERVICE_URL,
  windowsServiceApiKey: process.env.WINDOWS_SERVICE_API_KEY,
  frontendUrl: process.env.FRONTEND_URL,
  adminUrl: process.env.ADMIN_URL,
  logLevel: process.env.LOG_LEVEL,
};

export const config = configSchema.parse(envConfig);
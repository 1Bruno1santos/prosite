import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password deve ter no mínimo 8 caracteres'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: z.string().min(8, 'Password deve ter no mínimo 8 caracteres'),
});

export const castleSettingsSchema = z.object({
  autoFight: z.boolean(),
  autoUpgrade: z.boolean(),
  autoCollect: z.boolean(),
  maxTroops: z.number().int().min(0).max(999999),
  defenseStrategy: z.enum(['aggressive', 'defensive', 'balanced']),
}).passthrough();

export const createClientSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password deve ter no mínimo 8 caracteres'),
  billingDays: z.number().int().positive('Dias de uso deve ser positivo'),
});

export const updateClientSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  active: z.boolean().optional(),
  billingEnd: z.string().datetime().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).merge(paginationSchema);

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CastleSettingsInput = z.infer<typeof castleSettingsSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
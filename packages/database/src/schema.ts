import { sql } from 'drizzle-orm';
import { 
  sqliteTable, 
  text, 
  integer, 
  real,
  index,
  uniqueIndex
} from 'drizzle-orm/sqlite-core';

export const clients = sqliteTable('clients', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastLogin: integer('last_login', { mode: 'timestamp' }),
  billingEnd: integer('billing_end', { mode: 'timestamp' }),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
}, (table) => {
  return {
    emailIdx: uniqueIndex('clients_email_idx').on(table.email),
    activeIdx: index('clients_active_idx').on(table.active),
  };
});

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'super_admin'] }).notNull().default('admin'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastLogin: integer('last_login', { mode: 'timestamp' }),
}, (table) => {
  return {
    emailIdx: uniqueIndex('admin_users_email_idx').on(table.email),
  };
});

export const castles = sqliteTable('castles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientId: text('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  settingsJson: text('settings_json').notNull().default('{}'),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    clientIdx: index('castles_client_idx').on(table.clientId),
    nameIdx: index('castles_name_idx').on(table.name),
  };
});

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientId: text('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  castleId: text('castle_id')
    .notNull()
    .references(() => castles.id, { onDelete: 'cascade' }),
  field: text('field').notNull(),
  oldValue: text('old_value'),
  newValue: text('new_value'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    clientIdx: index('logs_client_idx').on(table.clientId),
    castleIdx: index('logs_castle_idx').on(table.castleId),
    createdAtIdx: index('logs_created_at_idx').on(table.createdAt),
    fieldIdx: index('logs_field_idx').on(table.field),
  };
});

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  settingsJson: text('settings_json').notNull().default('{}'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    nameIdx: uniqueIndex('templates_name_idx').on(table.name),
  };
});

export const refreshTokens = sqliteTable('refresh_tokens', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  token: text('token').notNull().unique(),
  userId: text('user_id').notNull(),
  userType: text('user_type', { enum: ['client', 'admin'] }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    tokenIdx: uniqueIndex('refresh_tokens_token_idx').on(table.token),
    userIdx: index('refresh_tokens_user_idx').on(table.userId, table.userType),
    expiresIdx: index('refresh_tokens_expires_idx').on(table.expiresAt),
  };
});

export const passwordResetTokens = sqliteTable('password_reset_tokens', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  token: text('token').notNull().unique(),
  email: text('email').notNull(),
  userType: text('user_type', { enum: ['client', 'admin'] }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  used: integer('used', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    tokenIdx: uniqueIndex('password_reset_tokens_token_idx').on(table.token),
    emailIdx: index('password_reset_tokens_email_idx').on(table.email),
  };
});

export const clientParamAllow = sqliteTable('client_param_allow', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientId: text('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  paramName: text('param_name').notNull(),
  allowed: integer('allowed', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    clientParamIdx: uniqueIndex('client_param_allow_idx').on(table.clientId, table.paramName),
  };
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type Castle = typeof castles.$inferSelect;
export type NewCastle = typeof castles.$inferInsert;
export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type ClientParamAllow = typeof clientParamAllow.$inferSelect;
export type NewClientParamAllow = typeof clientParamAllow.$inferInsert;
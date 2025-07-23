export interface User {
  id: string;
  email: string;
  createdAt: Date;
  lastLogin: Date | null;
  billingEnd: Date | null;
  active: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
}

export interface Castle {
  id: string;
  clientId: string;
  name: string;
  settings: CastleSettings;
  updatedAt: Date;
}

export interface CastleSettings {
  autoFight: boolean;
  autoUpgrade: boolean;
  autoCollect: boolean;
  maxTroops: number;
  defenseStrategy: 'aggressive' | 'defensive' | 'balanced';
  [key: string]: unknown;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Template {
  id: string;
  name: string;
  settings: Partial<CastleSettings>;
  createdAt: Date;
}

export interface LogEntry {
  id: string;
  clientId: string;
  castleId: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Metrics {
  activeClients: number;
  totalCastles: number;
  changesLastHour: number;
  changesLastDay: number;
  changesLastWeek: number;
  averageResponseTime: number;
}
import { Request } from 'express';
import { User, Role } from '@prisma/client';

// Auth Types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface TokenPayload {
  id: string;
  role: Role;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any[];
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  payload: any;
}

// Service Response Types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
  message?: string;
}

// File Upload Types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

// Analytics Types
export interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Error Types
export interface AppErrorParams {
  message: string;
  statusCode: number;
  isOperational?: boolean;
}

// Config Types
export interface AppConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  dbUrl: string;
  redisUrl?: string;
  corsOrigin: string | string[];
  logLevel: string;
}

// Cache Types
export interface CacheOptions {
  ttl?: number;
  namespace?: string;
}

// Version Control Types
export interface VersionControlConfig {
  provider: 'github' | 'gitlab' | 'gitea';
  baseUrl?: string;
  token: string;
}

// AI Types
export interface AIModelConfig {
  modelId: string;
  parameters: Record<string, any>;
  maxTokens?: number;
  temperature?: number;
}

export interface AIJobRequest {
  modelId: string;
  prompt: string;
  config: AIModelConfig;
  priority?: number;
}

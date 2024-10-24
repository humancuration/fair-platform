import { Role } from '@prisma/client';

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: number;
  userId: number;
  theme: string;
  notifications: any;
  language: string;
  timezone: string;
  emailPreferences: any;
  privacySettings: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIJob {
  id: number;
  userId: number;
  modelId: number;
  title: string;
  description?: string;
  status: JobStatus;
  priority: number;
  config: any;
  result?: any;
  createdAt: Date;
  updatedAt: Date;
}

export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

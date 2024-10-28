import { z } from 'zod';

export const AnalyticsEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().nullable(),
  eventType: z.string(),
  eventData: z.record(z.any()),
  timestamp: z.date(),
  sessionId: z.string().optional(),
  deviceInfo: z.object({
    userAgent: z.string(),
    platform: z.string(),
    deviceType: z.string()
  }).optional()
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

export interface AggregateOptions {
  startDate: Date;
  endDate: Date;
  groupBy?: string[];
  filters?: Record<string, any>;
}

export interface RetentionPolicy {
  anonymize: boolean;
  retentionPeriod: number; // in days
  dataCategories: string[];
}

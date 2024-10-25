import crypto from 'crypto';
import { prisma } from './AnalyticsEvent';
import logger from '../../utils/logger';
import { redisClient } from '../utils/redis';
import { trace, context } from '@opentelemetry/api';
import { WebSocket } from 'ws';

class AnalyticsService {
  private websockets: Map<string, WebSocket> = new Map();

  async trackEvent(userId: string | null, eventType: string, eventData: any) {
    const span = trace.getTracer('analytics-service').startSpan('trackEvent');
    
    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const event = await prisma.analyticsEvent.create({
          data: {
            userId,
            eventType,
            eventData,
          },
        });
        logger.info(`Event tracked: ${eventType} for user ${userId}`, { userId, eventType });
        return event;
      } catch (error) {
        logger.error(`Error tracking event: ${error}`, { userId, eventType, error });
        span.recordException(error as Error);
        throw new Error('Failed to track event');
      } finally {
        span.end();
      }
    });
  }

  async getAggregateData(eventType: string, startDate: Date, endDate: Date) {
    const span = trace.getTracer('analytics-service').startSpan('getAggregateData');
    
    return context.with(trace.setSpan(context.active(), span), async () => {
      const cacheKey = `aggregateData:${eventType}:${startDate.toISOString()}:${endDate.toISOString()}`;
      
      try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }

        const data = await prisma.analyticsEvent.groupBy({
          by: ['eventType'],
          where: {
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          _count: {
            eventType: true,
          },
        });

        await redisClient.setex(cacheKey, 3600, JSON.stringify(data));
        return data;
      } catch (error) {
        logger.error(`Error getting aggregate data: ${error}`);
        span.recordException(error as Error);
        throw new Error('Failed to get aggregate data');
      } finally {
        span.end();
      }
    });
  }

  async anonymizeUserData(userId: string) {
    const anonymizedId = crypto.createHash('sha256').update(userId).digest('hex');

    try {
      const [updatedCount] = await prisma.analyticsEvent.update(
        { where: { userId } },
        { data: { userId: anonymizedId } }
      );
      logger.info(`User data anonymized for user ${userId}. Updated ${updatedCount} records.`);
      return updatedCount;
    } catch (error) {
      logger.error(`Error anonymizing user data: ${error}`);
      throw new Error('Failed to anonymize user data');
    }
  }

  async deleteOldData(retentionPeriod: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);

    try {
      const deletedCount = await prisma.analyticsEvent.deleteMany({
        where: {
          timestamp: {
            [Op.lt]: cutoffDate,
          },
        },
      });
      logger.info(`Deleted ${deletedCount} old analytics events`);
      return deletedCount;
    } catch (error) {
      logger.error(`Error deleting old data: ${error}`);
      throw new Error('Failed to delete old data');
    }
  }

  async trackEventRealTime(userId: string | null, eventType: string, eventData: any) {
    const span = trace.getTracer('analytics-service').startSpan('trackEventRealTime');
    
    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const event = await this.trackEvent(userId, eventType, eventData);
        
        // Broadcast to real-time listeners
        this.broadcastEvent(event);
        
        return event;
      } catch (error) {
        logger.error(`Error tracking real-time event: ${error}`);
        span.recordException(error as Error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  private broadcastEvent(event: any) {
    const message = JSON.stringify(event);
    this.websockets.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
}

export default new AnalyticsService();

import { Op } from 'sequelize';
import crypto from 'crypto';
import AnalyticsEvent from '../models/AnalyticsEvent';
import logger from '../utils/logger';
import { redisClient } from '../utils/redis';
import { trace, context } from '@opentelemetry/api';

class AnalyticsService {
  async trackEvent(userId: number | null, eventType: string, eventData: any) {
    const span = trace.getTracer('analytics-service').startSpan('trackEvent');
    
    try {
      context.with(trace.setSpan(context.active(), span), async () => {
        await AnalyticsEvent.create({
          userId,
          eventType,
          eventData,
        });
        logger.info(`Event tracked: ${eventType} for user ${userId}`, { userId, eventType });
      });
    } catch (error) {
      logger.error(`Error tracking event: ${error}`, { userId, eventType, error });
      span.recordException(error as Error);
      throw new Error('Failed to track event');
    } finally {
      span.end();
    }
  }

  async getAggregateData(eventType: string, startDate: Date, endDate: Date) {
    const span = trace.getTracer('analytics-service').startSpan('getAggregateData');
    
    try {
      return await context.with(trace.setSpan(context.active(), span), async () => {
        const cacheKey = `aggregateData:${eventType}:${startDate.toISOString()}:${endDate.toISOString()}`;
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
          return JSON.parse(cachedData);
        }

        const data = await AnalyticsEvent.findAll({
          where: {
            eventType,
            timestamp: {
              [Op.between]: [startDate, endDate],
            },
          },
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            [sequelize.fn('DATE', sequelize.col('timestamp')), 'date'],
          ],
          group: [sequelize.fn('DATE', sequelize.col('timestamp'))],
          raw: true,
        });

        await redisClient.setex(cacheKey, 3600, JSON.stringify(data));
        return data;
      });
    } catch (error) {
      logger.error(`Error getting aggregate data: ${error}`);
      span.recordException(error as Error);
      throw new Error('Failed to get aggregate data');
    } finally {
      span.end();
    }
  }

  async anonymizeUserData(userId: number) {
    const anonymizedId = crypto.createHash('sha256').update(userId.toString()).digest('hex');

    try {
      await AnalyticsEvent.update(
        { userId: anonymizedId },
        {
          where: { userId },
        }
      );
      logger.info(`User data anonymized for user ${userId}`);
    } catch (error) {
      logger.error(`Error anonymizing user data: ${error}`);
      throw new Error('Failed to anonymize user data');
    }
  }

  async deleteOldData(retentionPeriod: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);

    try {
      const deletedCount = await AnalyticsEvent.destroy({
        where: {
          timestamp: {
            [Op.lt]: cutoffDate,
          },
        },
      });
      logger.info(`Deleted ${deletedCount} old analytics events`);
    } catch (error) {
      logger.error(`Error deleting old data: ${error}`);
      throw new Error('Failed to delete old data');
    }
  }
}

export default new AnalyticsService();

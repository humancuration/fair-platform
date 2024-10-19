import { Op } from 'sequelize';
import crypto from 'crypto';
import AnalyticsEvent from '../models/AnalyticsEvent';
import logger from '../utils/logger';
import { redisClient } from '../utils/redis';

class AnalyticsService {
  async trackEvent(userId: number | null, eventType: string, eventData: any) {
    try {
      await AnalyticsEvent.create({
        userId,
        eventType,
        eventData,
      });
      logger.info(`Event tracked: ${eventType} for user ${userId}`);
    } catch (error) {
      logger.error(`Error tracking event: ${error}`);
      throw new Error('Failed to track event');
    }
  }

  async getAggregateData(eventType: string, startDate: Date, endDate: Date) {
    const cacheKey = `aggregateData:${eventType}:${startDate.toISOString()}:${endDate.toISOString()}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    try {
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

      await redisClient.setex(cacheKey, 3600, JSON.stringify(data)); // Cache for 1 hour
      return data;
    } catch (error) {
      logger.error(`Error getting aggregate data: ${error}`);
      throw new Error('Failed to get aggregate data');
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

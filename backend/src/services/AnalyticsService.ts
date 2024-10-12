import { Op } from 'sequelize';
import crypto from 'crypto';
import AnalyticsEvent from '../models/AnalyticsEvent';

class AnalyticsService {
  async trackEvent(userId: number | null, eventType: string, eventData: any) {
    await AnalyticsEvent.create({
      userId,
      eventType,
      eventData,
    });
  }

  async getAggregateData(eventType: string, startDate: Date, endDate: Date) {
    return AnalyticsEvent.findAll({
      where: {
        eventType,
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        // Add more aggregate functions as needed
      ],
      raw: true,
    });
  }

  async anonymizeUserData(userId: number) {
    const anonymizedId = crypto.createHash('sha256').update(userId.toString()).digest('hex');

    await AnalyticsEvent.update(
      { userId: anonymizedId },
      {
        where: { userId },
      }
    );
  }

  async deleteOldData(retentionPeriod: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);

    await AnalyticsEvent.destroy({
      where: {
        timestamp: {
          [Op.lt]: cutoffDate,
        },
      },
    });
  }
}

export default new AnalyticsService();
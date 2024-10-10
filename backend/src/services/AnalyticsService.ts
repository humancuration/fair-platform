import mongoose from 'mongoose';
import crypto from 'crypto';

interface AnalyticsEvent {
  userId: string | null;
  eventType: string;
  eventData: any;
  timestamp: Date;
}

const AnalyticsEventSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  eventType: { type: String, required: true },
  eventData: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
});

const AnalyticsEvent = mongoose.model<AnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);

class AnalyticsService {
  async trackEvent(userId: string | null, eventType: string, eventData: any) {
    const event = new AnalyticsEvent({
      userId,
      eventType,
      eventData
    });
    await event.save();
  }

  async getAggregateData(eventType: string, startDate: Date, endDate: Date) {
    return AnalyticsEvent.aggregate([
      {
        $match: {
          eventType,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          // Add more aggregate operations as needed
        }
      }
    ]);
  }

  async anonymizeUserData(userId: string) {
    const anonymizedId = crypto.createHash('sha256').update(userId).digest('hex');

    await AnalyticsEvent.updateMany(
      { userId },
      { $set: { userId: anonymizedId } }
    );
  }

  async deleteOldData(retentionPeriod: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);

    await AnalyticsEvent.deleteMany({ timestamp: { $lt: cutoffDate } });
  }
}

export default new AnalyticsService();
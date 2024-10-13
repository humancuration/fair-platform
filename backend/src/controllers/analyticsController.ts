import { Request, Response } from 'express';
import AnalyticsService from '@services/analyticsService';

class AnalyticsController {
  async trackEvent(req: Request, res: Response) {
    try {
      const { eventType, eventData } = req.body;
      const userId = req.user ? req.user._id : null;
      await AnalyticsService.trackEvent(userId, eventType, eventData);
      res.status(200).json({ message: 'Event tracked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error tracking event', error });
    }
  }

  async getAggregateData(req: Request, res: Response) {
    try {
      const { eventType, startDate, endDate } = req.query;
      const data = await AnalyticsService.getAggregateData(
        eventType as string,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching aggregate data', error });
    }
  }
}

export default new AnalyticsController();

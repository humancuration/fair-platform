import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../utils/errors';
import { createLogger } from '../../../utils/logger';

const prisma = new PrismaClient();
const logger = createLogger('AnalyticsController');

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export const trackEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventType, eventData } = req.body;
  const userId = req.user?.id;

  try {
    await prisma.analyticsEvent.create({
      data: {
        userId: userId?.toString(),
        eventType,
        eventData,
        timestamp: new Date(),
      },
    });

    logger.info(`Analytics event tracked: ${eventType}`);
    res.status(200).json({ message: 'Event tracked successfully' });
  } catch (error) {
    logger.error('Error tracking event:', error);
    next(error);
  }
};

export const getAggregateData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventType } = req.query;
  const dateRange = parseDateRange(req.query);
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const events = await prisma.analyticsEvent.findMany({
      where: {
        userId: userId.toString(),
        eventType: eventType as string,
        timestamp: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    const aggregatedData = aggregateEvents(events);

    res.status(200).json({
      data: aggregatedData,
      metadata: {
        eventCount: events.length,
        dateRange,
      },
    });
  } catch (error) {
    logger.error('Error fetching aggregate data:', error);
    next(error);
  }
};

export const getAffiliatePerformance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const dateRange = parseDateRange(req.query);

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const performance = await prisma.affiliateLink.findMany({
      where: {
        userId,
        clicks: {
          some: {
            clickedAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate,
            },
          },
        },
      },
      include: {
        clicks: {
          where: {
            clickedAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate,
            },
          },
        },
        payouts: {
          where: {
            createdAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate,
            },
            status: 'completed',
          },
        },
        program: {
          select: {
            name: true,
            commissionRate: true,
          },
        },
      },
    });

    const performanceStats = performance.map(link => ({
      linkId: link.id,
      programName: link.program.name,
      clicks: link.clicks.length,
      earnings: link.payouts.reduce((sum, payout) => sum + payout.amount, 0),
      conversionRate: calculateConversionRate(link),
    }));

    res.status(200).json({
      data: performanceStats,
      dateRange,
    });
  } catch (error) {
    logger.error('Error fetching affiliate performance:', error);
    next(error);
  }
};

// Helper functions
function parseDateRange(query: any): DateRange {
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = query.endDate ? new Date(query.endDate) : new Date();

  return { startDate, endDate };
}

function aggregateEvents(events: any[]): Record<string, any> {
  return events.reduce((acc, event) => {
    const date = event.timestamp.toISOString().split('T')[0];
    acc[date] = acc[date] || [];
    acc[date].push(event.eventData);
    return acc;
  }, {});
}

function calculateConversionRate(link: any): number {
  if (!link.clicks.length) return 0;
  const conversions = link.payouts.length;
  return (conversions / link.clicks.length) * 100;
}

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../utils/errors';
import { createLogger } from '../../utils/logger';
import { Redis } from 'ioredis';

const prisma = new PrismaClient();
const logger = createLogger('MarketplaceAnalyticsController');
const redis = new Redis(process.env.REDIS_URL);

export const getMarketplaceAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.setDate(1));

    // Get real-time viewers from Redis
    const realtimeViewers = await redis.get('marketplace:activeUsers') || '0';

    // Get sales metrics using Prisma
    const [dailySales, weeklySales, monthlySales, totalSales] = await Promise.all([
      prisma.payout.aggregate({
        where: {
          createdAt: { gte: startOfDay },
          status: 'completed',
        },
        _sum: { amount: true },
      }),
      prisma.payout.aggregate({
        where: {
          createdAt: { gte: startOfWeek },
          status: 'completed',
        },
        _sum: { amount: true },
      }),
      prisma.payout.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          status: 'completed',
        },
        _sum: { amount: true },
      }),
      prisma.payout.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true },
      }),
    ]);

    // Get top performing affiliate programs
    const topPrograms = await prisma.affiliateProgram.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { affiliateLinks: true },
        },
        affiliateLinks: {
          select: {
            clicks: true,
            payouts: {
              where: { status: 'completed' },
              select: { amount: true },
            },
          },
        },
      },
      orderBy: {
        affiliateLinks: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    // Calculate conversion rate
    const totalVisitors = parseInt(await redis.get('marketplace:totalVisitors') || '0');
    const totalPurchases = await prisma.payout.count({
      where: { status: 'completed' },
    });
    const conversionRate = totalVisitors ? (totalPurchases / totalVisitors) * 100 : 0;

    // Get top affiliates
    const topAffiliates = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        _count: {
          select: { affiliateLinks: true },
        },
        affiliateLinks: {
          select: {
            clicks: true,
            payouts: {
              where: { status: 'completed' },
              select: { amount: true },
            },
          },
        },
      },
      orderBy: {
        affiliateLinks: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    res.status(200).json({
      metrics: {
        daily: dailySales._sum.amount || 0,
        weekly: weeklySales._sum.amount || 0,
        monthly: monthlySales._sum.amount || 0,
        total: totalSales._sum.amount || 0,
        averageOrderValue: totalPurchases ? (totalSales._sum.amount || 0) / totalPurchases : 0,
        topPrograms,
        conversionRate,
        topAffiliates,
      },
      realtimeViewers: parseInt(realtimeViewers),
    });
  } catch (error) {
    logger.error('Error fetching marketplace analytics:', error);
    next(error);
  }
};

export const trackRealtimeViewer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { action } = req.body; // 'join' or 'leave'
    const key = 'marketplace:activeUsers';

    if (action === 'join') {
      await redis.incr(key);
    } else if (action === 'leave') {
      await redis.decr(key);
    }

    const viewers = await redis.get(key);
    res.status(200).json({
      viewers: parseInt(viewers || '0'),
    });
  } catch (error) {
    logger.error('Error tracking realtime viewer:', error);
    next(error);
  }
};

export const trackPageView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await redis.incr('marketplace:totalVisitors');
    res.status(204).send();
  } catch (error) {
    logger.error('Error tracking page view:', error);
    next(error);
  }
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { redisClient } from '../../config/redis';

const prisma = new PrismaClient();

export const getMarketplaceAnalytics = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.setDate(1));

    // Get real-time viewers from Redis
    const realtimeViewers = await redisClient.get('marketplace:activeUsers') || '0';

    // Get sales metrics using Prisma
    const [dailySales, weeklySales, monthlySales, totalSales] = await Promise.all([
      prisma.transaction.aggregate({
        where: { createdAt: { gte: startOfDay } },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { createdAt: { gte: startOfWeek } },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true }
      })
    ]);

    // Get top selling products
    const topSellingProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { transactions: true }
        },
        transactions: {
          select: {
            amount: true
          }
        }
      },
      orderBy: {
        transactions: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Calculate conversion rate
    const totalVisitors = parseInt(await redisClient.get('marketplace:totalVisitors') || '0');
    const totalPurchases = await prisma.transaction.count();
    const conversionRate = totalVisitors ? (totalPurchases / totalVisitors) * 100 : 0;

    // Get affiliate performance
    const affiliatePerformance = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        _count: {
          select: { transactions: true }
        },
        transactions: {
          where: {
            affiliateId: { not: null }
          },
          select: {
            commission: true
          }
        }
      },
      orderBy: {
        transactions: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Get popular categories
    const popularCategories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        transactions: true
      },
      orderBy: {
        _count: {
          transactions: 'desc'
        }
      }
    });

    res.json({
      metrics: {
        daily: dailySales._sum.amount || 0,
        weekly: weeklySales._sum.amount || 0,
        monthly: monthlySales._sum.amount || 0,
        total: totalSales._sum.amount || 0,
        averageOrderValue: totalPurchases ? (totalSales._sum.amount || 0) / totalPurchases : 0,
        topSellingProducts,
        conversionRate,
        affiliatePerformance
      },
      realtimeViewers: parseInt(realtimeViewers),
      popularCategories
    });
  } catch (error) {
    console.error('Error fetching marketplace analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};

// Track real-time viewers
export const trackRealtimeViewer = async (req: Request, res: Response) => {
  try {
    const { action } = req.body; // 'join' or 'leave'
    const key = 'marketplace:activeUsers';
    
    if (action === 'join') {
      await redisClient.incr(key);
    } else if (action === 'leave') {
      await redisClient.decr(key);
    }

    const viewers = await redisClient.get(key);
    res.json({ viewers: parseInt(viewers || '0') });
  } catch (error) {
    console.error('Error tracking realtime viewer:', error);
    res.status(500).json({ message: 'Failed to track viewer' });
  }
};

// Track page view for conversion rate calculation
export const trackPageView = async (req: Request, res: Response) => {
  try {
    await redisClient.incr('marketplace:totalVisitors');
    res.status(204).send();
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ message: 'Failed to track page view' });
  }
};

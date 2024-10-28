import { prisma } from '../lib/prisma';
import type { Analytics } from '@prisma/client';

export class AnalyticsService {
  static async trackEvent(minsiteId: string, data: {
    views?: number;
    visitors?: number;
    conversions?: number;
    revenue?: number;
    additionalData?: any;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.analytics.upsert({
      where: {
        minsiteId_date: {
          minsiteId,
          date: today
        }
      },
      create: {
        minsiteId,
        date: today,
        views: data.views ?? 0,
        visitors: data.visitors ?? 0,
        conversions: data.conversions ?? 0,
        revenue: data.revenue ?? 0,
        data: data.additionalData
      },
      update: {
        views: { increment: data.views ?? 0 },
        visitors: { increment: data.visitors ?? 0 },
        conversions: { increment: data.conversions ?? 0 },
        revenue: { increment: data.revenue ?? 0 },
        data: data.additionalData
      }
    });
  }

  static async getAnalytics(minsiteId: string, range: 'day' | 'week' | 'month' | 'year') {
    const now = new Date();
    const start = new Date();

    switch (range) {
      case 'day':
        start.setDate(start.getDate() - 1);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }

    return prisma.analytics.findMany({
      where: {
        minsiteId,
        date: {
          gte: start,
          lte: now
        }
      },
      orderBy: { date: 'asc' }
    });
  }

  static async getTopPerformers(userId: string, limit = 5) {
    return prisma.minsite.findMany({
      where: { userId },
      include: {
        analytics: {
          orderBy: { date: 'desc' },
          take: 30
        }
      },
      orderBy: {
        analytics: {
          _count: 'desc'
        }
      },
      take: limit
    });
  }
}

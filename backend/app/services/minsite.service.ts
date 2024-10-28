import { prisma } from '../lib/prisma';
import type { MinsiteCreateInput, MinsiteUpdateInput } from '@fair-platform/shared/types';

export class MinsiteService {
  static async create(userId: string, data: MinsiteCreateInput) {
    return prisma.minsite.create({
      data: {
        ...data,
        user: {
          connect: { id: userId }
        }
      },
      include: {
        versions: true,
        uploads: true,
        affiliateLinks: true,
        analytics: true
      }
    });
  }

  static async update(id: string, userId: string, data: MinsiteUpdateInput) {
    const existing = await prisma.minsite.findUnique({
      where: { id }
    });

    if (!existing || existing.userId !== userId) {
      throw new Error('Minsite not found');
    }

    // Create version before updating
    if (data.content) {
      await prisma.minsiteVersion.create({
        data: {
          minsiteId: id,
          content: existing.content,
          title: existing.title,
          template: existing.template,
          customCSS: existing.customCSS
        }
      });
    }

    return prisma.minsite.update({
      where: { id },
      data,
      include: {
        versions: true,
        uploads: true,
        affiliateLinks: true,
        analytics: true
      }
    });
  }

  static async trackAnalytics(minsiteId: string, data: {
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
}

// models/ClickTracking.ts

import { PrismaClient } from '@prisma/client';
import type { ClickTracking as PrismaClickTracking } from '@prisma/client';

const prisma = new PrismaClient();

export type ClickTrackingCreate = Omit<PrismaClickTracking, 'id' | 'createdAt' | 'updatedAt'>;

export const ClickTrackingModel = {
  create: async (data: ClickTrackingCreate): Promise<PrismaClickTracking> => {
    return prisma.clickTracking.create({
      data,
      include: {
        affiliateLink: true
      }
    });
  },

  findByAffiliateLink: async (affiliateLinkId: number): Promise<PrismaClickTracking[]> => {
    return prisma.clickTracking.findMany({
      where: { affiliateLinkId },
      include: {
        affiliateLink: true
      }
    });
  },

  getClickStats: async (affiliateLinkId: number) => {
    const stats = await prisma.clickTracking.groupBy({
      by: ['affiliateLinkId'],
      where: { affiliateLinkId },
      _count: true,
      _min: {
        clickedAt: true
      },
      _max: {
        clickedAt: true
      }
    });

    return stats[0] || null;
  }
};

export default ClickTrackingModel;

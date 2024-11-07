import { prisma } from '../../lib/prisma';

export class WishlistMetricsService {
  async getUserWishlistStats(userId: string) {
    const [itemCount, totalReceived, completedGoals] = await Promise.all([
      prisma.wishlistItem.count({
        where: { userId }
      }),
      prisma.wishlistItem.aggregate({
        where: { userId },
        _sum: {
          currentAmount: true
        }
      }),
      prisma.wishlistItem.count({
        where: {
          userId,
          currentAmount: {
            gte: prisma.wishlistItem.fields.targetAmount
          }
        }
      })
    ]);

    return {
      itemCount,
      totalReceived: totalReceived._sum.currentAmount || 0,
      completedGoals
    };
  }

  async getCommunityWishlistStats() {
    const [totalItems, activeItems, totalContributed] = await Promise.all([
      prisma.communityWishlistItem.count(),
      prisma.communityWishlistItem.count({
        where: {
          currentAmount: {
            lt: prisma.communityWishlistItem.fields.targetAmount
          }
        }
      }),
      prisma.communityWishlistItem.aggregate({
        _sum: {
          currentAmount: true
        }
      })
    ]);

    return {
      totalItems,
      activeItems,
      totalContributed: totalContributed._sum.currentAmount || 0
    };
  }

  async getPopularCategories() {
    return prisma.communityWishlistItem.groupBy({
      by: ['category'],
      _count: true,
      orderBy: {
        _count: {
          category: 'desc'
        }
      },
      take: 5
    });
  }
} 
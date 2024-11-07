import { CronJob } from 'cron';
import { prisma } from '../lib/prisma';
import { NotificationService } from '../modules/notification/notificationService';

export class WishlistJobs {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
    this.initJobs();
  }

  private initJobs() {
    // Check for stale wishlist items - runs daily at midnight
    new CronJob('0 0 * * *', this.checkStaleWishlistItems.bind(this), null, true);

    // Update trending community items - runs every hour
    new CronJob('0 * * * *', this.updateTrendingItems.bind(this), null, true);
  }

  private async checkStaleWishlistItems() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const staleItems = await prisma.wishlistItem.findMany({
      where: {
        updatedAt: {
          lt: thirtyDaysAgo
        },
        currentAmount: {
          gt: 0,
          lt: prisma.wishlistItem.fields.targetAmount
        }
      },
      include: {
        user: true
      }
    });

    for (const item of staleItems) {
      await this.notificationService.create({
        userId: item.userId,
        type: 'STALE_ITEM',
        message: `Your wishlist item "${item.name}" hasn't had any activity in 30 days`,
        metadata: { itemId: item.id }
      });
    }
  }

  private async updateTrendingItems() {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Get items with most contributions/highlights in last 24 hours
    const trendingItems = await prisma.communityWishlistItem.findMany({
      where: {
        OR: [
          {
            highlights: {
              some: {
                createdAt: {
                  gte: twentyFourHoursAgo
                }
              }
            }
          }
        ]
      },
      include: {
        _count: {
          select: {
            highlights: true
          }
        }
      },
      orderBy: {
        highlights: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Cache trending items for API
    await prisma.keyValueStore.upsert({
      where: { key: 'trending_wishlist_items' },
      create: {
        key: 'trending_wishlist_items',
        value: JSON.stringify(trendingItems)
      },
      update: {
        value: JSON.stringify(trendingItems)
      }
    });
  }
} 
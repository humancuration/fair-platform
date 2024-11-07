import { prisma } from '../../lib/prisma';
import { PubSub } from '../../lib/pubsub';
import { NotificationService } from '../notification/notificationService';

export class WishlistService {
  private notificationService: NotificationService;
  private pubsub: PubSub;

  constructor() {
    this.notificationService = new NotificationService();
    this.pubsub = new PubSub();
  }

  async notifyWishlistContribution(itemId: string, contributorId: string, amount: number) {
    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      include: { user: true }
    });

    if (!item) return;

    // Notify item owner
    await this.notificationService.create({
      userId: item.userId,
      type: 'CONTRIBUTION',
      message: `Someone contributed ${amount} to your wishlist item: ${item.name}`,
      metadata: {
        itemId,
        contributorId,
        amount
      }
    });

    // Publish event for real-time updates
    this.pubsub.publish(`wishlist:${itemId}:contribution`, {
      itemId,
      contributorId,
      amount
    });
  }

  async checkWishlistGoals(itemId: string) {
    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId }
    });

    if (!item || !item.targetAmount) return;

    if (item.currentAmount >= item.targetAmount) {
      await this.notificationService.create({
        userId: item.userId,
        type: 'GOAL_REACHED',
        message: `Your wishlist item "${item.name}" has reached its goal!`,
        metadata: { itemId }
      });
    }
  }
} 
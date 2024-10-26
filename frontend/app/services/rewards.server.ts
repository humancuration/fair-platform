import { prisma } from '~/utils/db.server';

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  campaignId: string;
  type: 'badge' | 'coupon' | 'item';
  status: 'active' | 'inactive' | 'expired';
}

export async function getAvailableRewards() {
  return prisma.reward.findMany({
    where: {
      status: 'active',
    },
  });
}

export async function redeemReward(userId: string, rewardId: string) {
  return prisma.$transaction(async (tx) => {
    const reward = await tx.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || reward.status !== 'active') {
      throw new Error('Reward not available');
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!user || user.points < reward.points) {
      throw new Error('Insufficient points');
    }

    // Update user points and create redemption record
    await tx.user.update({
      where: { id: userId },
      data: { points: user.points - reward.points },
    });

    return tx.rewardRedemption.create({
      data: {
        userId,
        rewardId,
        pointsSpent: reward.points,
      },
    });
  });
}

export async function getRewardsByCampaign(campaignId: string) {
  return prisma.reward.findMany({
    where: { campaignId },
    include: {
      campaign: true,
      redemptions: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
}

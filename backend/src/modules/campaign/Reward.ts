import { PrismaClient } from '@prisma/client';
import type { CampaignReward, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export type RewardCreate = Omit<CampaignReward, 'id' | 'createdAt' | 'updatedAt'>;
export type RewardUpdate = Partial<RewardCreate>;

export const RewardModel = {
  create: async (data: RewardCreate): Promise<CampaignReward> => {
    return prisma.campaignReward.create({
      data,
      include: {
        campaign: true
      }
    });
  },

  findById: async (id: number): Promise<CampaignReward | null> => {
    return prisma.campaignReward.findUnique({
      where: { id },
      include: {
        campaign: true
      }
    });
  },

  findByCampaign: async (campaignId: string): Promise<CampaignReward[]> => {
    return prisma.campaignReward.findMany({
      where: { campaignId },
      include: {
        campaign: true
      }
    });
  },

  update: async (id: number, data: RewardUpdate): Promise<CampaignReward> => {
    return prisma.campaignReward.update({
      where: { id },
      data,
      include: {
        campaign: true
      }
    });
  },

  delete: async (id: number): Promise<CampaignReward> => {
    return prisma.campaignReward.delete({
      where: { id }
    });
  },

  // Additional methods for reward management
  getAvailableRewards: async (campaignId: string, contributionAmount: number): Promise<CampaignReward[]> => {
    return prisma.campaignReward.findMany({
      where: {
        campaignId,
        amount: {
          lte: contributionAmount
        }
      },
      orderBy: {
        amount: 'desc'
      }
    });
  },

  checkEligibility: async (userId: number, rewardId: number): Promise<boolean> => {
    const reward = await prisma.campaignReward.findUnique({
      where: { id: rewardId },
      include: {
        campaign: {
          include: {
            participants: {
              where: {
                userId
              }
            }
          }
        }
      }
    });

    if (!reward) return false;

    const userContributions = await prisma.contribution.aggregate({
      where: {
        campaignId: reward.campaignId,
        contributorId: userId
      },
      _sum: {
        amount: true
      }
    });

    return (userContributions._sum.amount || 0) >= reward.amount;
  }
};

export default RewardModel;

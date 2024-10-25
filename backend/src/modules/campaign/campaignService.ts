import { PrismaClient, Campaign, CampaignParticipant, CampaignReward } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../utils/errors';
import logger from '../../utils/logger';
import { NotificationService } from '../../services/notificationService';

const prisma = new PrismaClient();

export class CampaignService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async createCampaign(campaignData: Partial<Campaign>, creatorId: number): Promise<Campaign> {
    try {
      const campaign = await prisma.campaign.create({
        data: {
          ...campaignData,
          createdById: creatorId,
          status: 'ACTIVE'
        }
      });

      logger.info(`Campaign created by user ${creatorId}`);
      return campaign;
    } catch (error) {
      logger.error('Error creating campaign:', error);
      throw error;
    }
  }

  async createCampaignWithMilestones(
    campaignData: Partial<Campaign>, 
    milestones: any[], 
    creatorId: number
  ): Promise<Campaign> {
    try {
      const campaign = await prisma.$transaction(async (tx) => {
        // Create campaign
        const newCampaign = await tx.campaign.create({
          data: {
            ...campaignData,
            createdById: creatorId,
            status: 'ACTIVE'
          }
        });

        // Create milestones
        await Promise.all(milestones.map(milestone =>
          tx.campaignReward.create({
            data: {
              campaignId: newCampaign.id,
              ...milestone
            }
          })
        ));

        return newCampaign;
      });

      // Notify followers
      await this.notifyFollowers(campaign);

      return campaign;
    } catch (error) {
      logger.error('Error creating campaign with milestones:', error);
      throw error;
    }
  }

  private async notifyFollowers(campaign: Campaign) {
    const followers = await prisma.user.findMany({
      where: {
        groupMemberships: {
          some: {
            group: {
              members: {
                some: {
                  userId: campaign.createdById
                }
              }
            }
          }
        }
      }
    });

    await this.notificationService.sendBulkNotifications(
      followers,
      'NEW_CAMPAIGN',
      { campaignId: campaign.id, title: campaign.title }
    );
  }

  async getAllCampaigns(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        skip,
        take: limit,
        include: {
          rewards: true,
          participants: true,
          createdBy: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }),
      prisma.campaign.count()
    ]);

    return { campaigns, total };
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        rewards: true,
        participants: true,
        createdBy: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    return campaign;
  }

  async updateCampaign(id: string, updateData: Partial<Campaign>): Promise<Campaign> {
    const campaign = await this.getCampaignById(id);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    return prisma.campaign.update({
      where: { id },
      data: updateData,
      include: {
        rewards: true,
        participants: true
      }
    });
  }

  async deleteCampaign(id: string): Promise<void> {
    const campaign = await this.getCampaignById(id);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    await prisma.campaign.delete({ where: { id } });
  }

  async addReward(campaignId: string, rewardData: Partial<CampaignReward>): Promise<CampaignReward> {
    const campaign = await this.getCampaignById(campaignId);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    return prisma.campaignReward.create({
      data: {
        ...rewardData,
        campaignId
      }
    });
  }

  async getRewardsByCampaign(campaignId: string): Promise<CampaignReward[]> {
    const campaign = await this.getCampaignById(campaignId);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    return prisma.campaignReward.findMany({
      where: { campaignId }
    });
  }
}

export const campaignService = new CampaignService();

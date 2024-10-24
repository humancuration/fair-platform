import { Transaction } from 'sequelize';
import { Campaign } from './Campaign';
import { User } from '../user/User';
import { Reward } from './Reward';
import { Contribution } from './Contribution';
import { CampaignRepository } from '../../repositories/CampaignRepository';
import { RewardRepository } from '../../repositories/RewardRepository';
import { NotFoundError, ValidationError } from '../../utils/errors';
import logger from '../../utils/logger';
import { sequelize } from '../../config/database';
import { NotificationService } from '../../services/notificationService';

export class CampaignService {
  private campaignRepo: CampaignRepository;
  private rewardRepo: RewardRepository;
  private notificationService: NotificationService;

  constructor() {
    this.campaignRepo = new CampaignRepository();
    this.rewardRepo = new RewardRepository();
    this.notificationService = new NotificationService();
  }

  async createCampaign(campaignData: Partial<Campaign>, creatorId: number): Promise<Campaign> {
    const transaction = await sequelize.transaction();

    try {
      const campaign = await this.campaignRepo.create({
        ...campaignData,
        creatorId,
        currentAmount: 0,
        isActive: true
      }, { transaction });

      await transaction.commit();
      logger.info(`Campaign created by user ${creatorId}`);
      return campaign;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating campaign:', error);
      throw error;
    }
  }

  async createCampaignWithMilestones(campaignData: Partial<Campaign>, milestones: any[], creatorId: number): Promise<Campaign> {
    const transaction = await sequelize.transaction();

    try {
      const campaign = await this.campaignRepo.create({
        ...campaignData,
        creatorId,
        currentAmount: 0,
        isActive: true
      }, { transaction });

      // Add milestone tracking
      await Promise.all(milestones.map(milestone => 
        this.createMilestone(campaign.id, milestone, transaction)
      ));

      await transaction.commit();
      
      // Trigger notifications
      await this.notifyFollowers(campaign);
      
      return campaign;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async notifyFollowers(campaign: Campaign) {
    const followers = await this.getCreatorFollowers(campaign.creatorId);
    await this.notificationService.sendBulkNotifications(
      followers,
      'NEW_CAMPAIGN',
      { campaignId: campaign.id, title: campaign.title }
    );
  }

  async getAllCampaigns(page: number, limit: number): Promise<{ campaigns: Campaign[]; total: number }> {
    return this.campaignRepo.findAll({
      page,
      limit,
      include: ['rewards', 'contributions'],
    });
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    const campaign = await Campaign.findByPk(id, {
      include: [
        { model: Reward, as: 'rewards' },
        { model: Contribution, as: 'contributions' },
        { model: User, as: 'creator', attributes: ['id', 'username'] },
      ],
    });

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    return campaign;
  }

  async updateCampaign(id: number, updateData: Partial<Campaign>): Promise<Campaign> {
    const campaign = await this.getCampaignById(id);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    Object.assign(campaign, updateData);
    await campaign.save();

    return campaign;
  }

  async deleteCampaign(id: number): Promise<void> {
    const campaign = await this.getCampaignById(id);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    await campaign.destroy();
  }

  async addReward(campaignId: number, rewardData: Partial<Reward>): Promise<Reward> {
    const campaign = await this.getCampaignById(campaignId);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    const reward = await this.rewardRepo.create({
      ...rewardData,
      campaignId,
    });

    return reward;
  }

  async getRewardsByCampaign(campaignId: number): Promise<Reward[]> {
    const campaign = await this.getCampaignById(campaignId);

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    return this.rewardRepo.findByCampaign(campaignId);
  }
}

export const campaignService = new CampaignService();

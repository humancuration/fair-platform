import { Reward } from '../modules/campaign/Reward';
import logger from '../utils/logger';

export class RewardRepository {
  async create(rewardData: Partial<Reward>): Promise<Reward> {
    try {
      return await Reward.create(rewardData);
    } catch (error) {
      logger.error('Error creating reward:', error);
      throw error;
    }
  }

  async findByCampaign(campaignId: number): Promise<Reward[]> {
    try {
      return await Reward.findAll({ where: { campaignId } });
    } catch (error) {
      logger.error('Error finding rewards:', error);
      throw error;
    }
  }
}

import { Campaign } from '../modules/campaign/Campaign';
import { Transaction } from 'sequelize';
import logger from '../utils/logger';

export class CampaignRepository {
  async create(campaignData: Partial<Campaign>, options?: { transaction?: Transaction }): Promise<Campaign> {
    try {
      return await Campaign.create(campaignData, options);
    } catch (error) {
      logger.error('Error creating campaign:', error);
      throw error;
    }
  }

  async findAll(options: { page: number; limit: number; include?: string[] }) {
    try {
      const offset = (options.page - 1) * options.limit;
      const { rows, count } = await Campaign.findAndCountAll({
        limit: options.limit,
        offset,
        include: options.include
      });
      return {
        campaigns: rows,
        total: count
      };
    } catch (error) {
      logger.error('Error finding campaigns:', error);
      throw error;
    }
  }
}

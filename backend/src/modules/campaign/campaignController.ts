import { Request, Response, NextFunction } from 'express';
import { Campaign } from '@/modules/campaign/Campaign';
import Reward from '@/modules/campaign/Reward';
import Contribution from '@/modules/campaign/Contribution';
import { CampaignRepository } from '@repositories/CampaignRepository';
import { RewardRepository } from '@repositories/RewardRepository';
import { NotFoundError, ValidationError } from '@utils/errors';
import logger from '@utils/logger';
import { sequelize } from '@config/database';

const campaignRepo = new CampaignRepository();
const rewardRepo = new RewardRepository();

// Create a new campaign
export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, goalAmount } = req.body;
  const creatorId = req.user?.id;

  if (!creatorId) {
    return next(new ValidationError('User not authenticated'));
  }

  const transaction = await sequelize.transaction();

  try {
    const campaign = await campaignRepo.create({
      title,
      description,
      goalAmount,
      creatorId,
      currentAmount: 0,
      isActive: true
    }, { transaction });

    await transaction.commit();

    logger.info(`Campaign created by user ${creatorId}`);
    res.status(201).json(campaign);
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating campaign:', error);
    next(error);
  }
};

// Get all campaigns
export const getAllCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const campaigns = await campaignRepo.findAll({
      page: Number(page),
      limit: Number(limit),
      include: ['rewards', 'contributions'],
    });

    res.status(200).json(campaigns);
  } catch (error) {
    logger.error('Error fetching campaigns:', error);
    next(error);
  }
};

// Get a single campaign by ID
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByPk(id, {
      include: [
        { model: Reward, as: 'rewards' },
        { model: Contribution, as: 'contributions' },
      ],
    });
    if (campaign) {
      res.status(200).json(campaign);
    } else {
      res.status(404).json({ error: 'Campaign not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign.' });
  }
};

// Update a campaign
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, goalAmount } = req.body;
    const campaign = await Campaign.findByPk(id);
    if (campaign) {
      campaign.title = title || campaign.title;
      campaign.description = description || campaign.description;
      campaign.goalAmount = goalAmount || campaign.goalAmount;
      await campaign.save();
      res.status(200).json(campaign);
    } else {
      res.status(404).json({ error: 'Campaign not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update campaign.' });
  }
};

// Delete a campaign
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByPk(id);
    if (campaign) {
      await campaign.destroy();
      res.status(200).json({ message: 'Campaign deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Campaign not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign.' });
  }
};

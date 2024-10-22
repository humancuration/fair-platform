import { Request, Response, NextFunction } from 'express';
import { campaignService } from './campaignService';
import { ValidationError } from '../../utils/errors';
import logger from '../../utils/logger';

export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, goalAmount } = req.body;
  const creatorId = req.user?.id;

  if (!creatorId) {
    return next(new ValidationError('User not authenticated'));
  }

  try {
    const campaign = await campaignService.createCampaign({ title, description, goalAmount }, creatorId);
    res.status(201).json(campaign);
  } catch (error) {
    logger.error('Error creating campaign:', error);
    next(error);
  }
};

export const getAllCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const campaigns = await campaignService.getAllCampaigns(Number(page), Number(limit));
    res.status(200).json(campaigns);
  } catch (error) {
    logger.error('Error fetching campaigns:', error);
    next(error);
  }
};

export const getCampaignById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const campaign = await campaignService.getCampaignById(Number(id));
    res.status(200).json(campaign);
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, goalAmount } = req.body;
    const campaign = await campaignService.updateCampaign(Number(id), { title, description, goalAmount });
    res.status(200).json(campaign);
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await campaignService.deleteCampaign(Number(id));
    res.status(200).json({ message: 'Campaign deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const addReward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { campaignId } = req.params;
    const { title, description, amount } = req.body;
    const reward = await campaignService.addReward(Number(campaignId), { title, description, amount });
    res.status(201).json(reward);
  } catch (error) {
    next(error);
  }
};

export const getRewardsByCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { campaignId } = req.params;
    const rewards = await campaignService.getRewardsByCampaign(Number(campaignId));
    res.status(200).json(rewards);
  } catch (error) {
    next(error);
  }
};

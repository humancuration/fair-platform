import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import Reward from '../models/Reward';
import Contribution from '../models/Contribution';

// Create a new campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { title, description, goalAmount, creatorId } = req.body;
    const campaign = await Campaign.create({ title, description, goalAmount, creatorId });
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campaign.' });
  }
};

// Get all campaigns
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.findAll({
      include: [
        { model: Reward, as: 'rewards' },
        { model: Contribution, as: 'contributions' },
      ],
    });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns.' });
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
import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import Contribution from '../models/Contribution';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { title, description, goal, deadline, rewards, category, image } = req.body;
    const creator = req.user.id;

    const campaign = new Campaign({
      title,
      description,
      goal,
      deadline,
      rewards,
      category,
      image,
      creator,
    });

    await campaign.save();

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.find({ isActive: true }).populate('creator', 'username');

    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('creator', 'username')
      .populate('rewards');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Only the creator can update the campaign
    if (campaign.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updates = req.body;
    Object.assign(campaign, updates);

    await campaign.save();

    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Only the creator can delete the campaign
    if (campaign.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    campaign.isActive = false;
    await campaign.save();

    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
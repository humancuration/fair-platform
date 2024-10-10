import { Request, Response } from 'express';
import Reward from '../models/Reward';
import Campaign from '../models/Campaign';

export const addReward = async (req: Request, res: Response) => {
  try {
    const { campaignId, title, description, amount } = req.body;
    const creatorId = req.user.id;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Only the campaign creator can add rewards
    if (campaign.creator.toString() !== creatorId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const reward = new Reward({
      campaign: campaignId,
      title,
      description,
      amount,
    });

    await reward.save();

    res.status(201).json(reward);
  } catch (error) {
    console.error('Error adding reward:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getRewardsByCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const rewards = await Reward.find({ campaign: campaignId });

    res.status(200).json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
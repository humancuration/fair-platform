import { Request, Response } from 'express';
import { Reward } from '../models/Reward';
import { UserReward } from '../models/UserReward';
import { Campaign } from '../models/Campaign';

export const getAvailableRewards = async (_req: Request, res: Response) => {
  try {
    const rewards = await Reward.findAll();
    res.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const redeemReward = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { rewardId } = req.body;

  try {
    const userReward = await UserReward.findOne({ where: { userId } });
    const reward = await Reward.findByPk(rewardId);

    if (!userReward || !reward) {
      return res.status(404).json({ message: 'User reward or reward not found.' });
    }

    if (userReward.totalPoints >= reward.amount) {
      userReward.totalPoints -= reward.amount;
      userReward.rewardsEarned.push(reward.id);
      await userReward.save();

      res.json({ message: 'Reward redeemed successfully!' });
    } else {
      res.status(400).json({ message: 'Not enough points to redeem this reward.' });
    }
  } catch (error) {
    console.error('Error redeeming reward:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addReward = async (req: Request, res: Response) => {
  try {
    const { campaignId, title, description, amount } = req.body;
    const creatorId = (req as any).user.id;

    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.creatorId.toString() !== creatorId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const reward = await Reward.create({
      campaignId,
      title,
      description,
      amount
    });

    res.status(201).json(reward);
  } catch (error) {
    console.error('Error adding reward:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getRewardsByCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const rewards = await Reward.findAll({ where: { campaignId } });

    res.status(200).json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

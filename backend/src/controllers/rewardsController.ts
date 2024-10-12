import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import Reward from '../models/Reward';
import { UserReward } from '../models/UserReward';
import Campaign from '../models/Campaign';

export const getAvailableRewards = async (req: Request, res: Response) => {
  const rewardRepository = AppDataSource.getRepository(Reward);
  const rewards = await rewardRepository.find();
  res.json(rewards);
};

export const redeemReward = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { rewardId } = req.body;

  const userRewardRepository = AppDataSource.getRepository(UserReward);
  const rewardRepository = AppDataSource.getRepository(Reward);

  const userReward = await userRewardRepository.findOne({ where: { user_id: userId } });
  const reward = await rewardRepository.findOne({ where: { id: rewardId } });

  if (!userReward || !reward) {
    return res.status(404).json({ message: 'User reward or reward not found.' });
  }

  if (userReward.total_points >= reward.points_required) {
    userReward.total_points -= reward.points_required;
    userReward.rewards_earned.push(reward.id);
    await userRewardRepository.save(userReward);

    res.json({ message: 'Reward redeemed successfully!' });
  } else {
    res.status(400).json({ message: 'Not enough points to redeem this reward.' });
  }
};

export const addReward = async (req: Request, res: Response) => {
  try {
    const { campaignId, title, description, amount } = req.body;
    const creatorId = (req as any).user.id;

    const campaignRepository = AppDataSource.getRepository(Campaign);
    const campaign = await campaignRepository.findOne({ where: { id: campaignId } });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Only the campaign creator can add rewards
    if (campaign.creator.toString() !== creatorId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const rewardRepository = AppDataSource.getRepository(Reward);
    const reward = rewardRepository.create({
      campaign,
      title,
      description,
      amount
    });

    await rewardRepository.save(reward);

    res.status(201).json(reward);
  } catch (error) {
    console.error('Error adding reward:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getRewardsByCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const rewardRepository = AppDataSource.getRepository(Reward);
    const rewards = await rewardRepository.find({ where: { campaign: { id: campaignId } } });

    res.status(200).json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

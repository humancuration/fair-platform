import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Reward } from '@models/Reward';
import { UserReward } from '@models/UserReward';

export const getAvailableRewards = async (req: Request, res: Response) => {
  const rewardRepository = getRepository(Reward);
  const rewards = await rewardRepository.find();
  res.json(rewards);
};

export const redeemReward = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { rewardId } = req.body;

  const userRewardRepository = getRepository(UserReward);
  const rewardRepository = getRepository(Reward);

  const userReward = await userRewardRepository.findOne({ user_id: userId });
  const reward = await rewardRepository.findOne(rewardId);

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
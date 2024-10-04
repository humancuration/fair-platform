import { getRepository } from 'typeorm';
import { UserReward } from '@models/UserReward';
import { rewardsConfig } from '@config/rewardsConfig';

export const awardPoints = async (userId: number, activityType: string) => {
  const points = rewardsConfig.activities[activityType] || 0;
  if (points > 0) {
    const userRewardRepository = getRepository(UserReward);
    let userReward = await userRewardRepository.findOne({ user_id: userId });
    
    if (!userReward) {
      userReward = userRewardRepository.create({ user_id: userId, total_points: 0, rewards_earned: [] });
    }
    
    userReward.total_points += points;
    await userRewardRepository.save(userReward);
  }
};
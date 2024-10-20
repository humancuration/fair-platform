import { AppDataSource } from '../data-source';
import { UserReward } from '../models/UserReward';
import { rewardsConfig } from '../../config/rewardsConfig';
import logger from '../../utils/logger';

export const awardPoints = async (userId: number, activityType: string): Promise<void> => {
  const points = rewardsConfig.activities[activityType] || 0;
  if (points > 0) {
    try {
      const userRewardRepository = AppDataSource.getRepository(UserReward);
      let userReward = await userRewardRepository.findOne({ where: { user_id: userId } });
      
      if (!userReward) {
        userReward = userRewardRepository.create({ user_id: userId, total_points: 0, rewards_earned: [] });
      }
      
      userReward.total_points += points;
      await userRewardRepository.save(userReward);
      
      logger.info(`Awarded ${points} points to user ${userId} for activity: ${activityType}`);
    } catch (error) {
      logger.error(`Error awarding points to user ${userId}: ${error}`);
      throw new Error(`Failed to award points: ${error.message}`);
    }
  }
};

export const getUserRewards = async (userId: number): Promise<UserReward | null> => {
  try {
    const userRewardRepository = AppDataSource.getRepository(UserReward);
    const userReward = await userRewardRepository.findOne({ where: { user_id: userId } });
    return userReward;
  } catch (error) {
    logger.error(`Error fetching rewards for user ${userId}: ${error}`);
    throw new Error(`Failed to fetch user rewards: ${error.message}`);
  }
};

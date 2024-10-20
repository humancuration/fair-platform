import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { UserActivity } from '../models/UserActivity';
import { awardPoints } from '../modules/campaign/rewardsService';
import logger from '../utils/logger';

export const activityLogger = (activityType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (userId) {
      try {
        await logActivity(userId, activityType);
      } catch (error) {
        logger.error(`Failed to log activity: ${error}`);
        // Continue execution even if logging fails
      }
    }
    next();
  };
};

const logActivity = async (userId: number, activityType: string) => {
  const activityRepository = AppDataSource.getRepository(UserActivity);
  const activity = activityRepository.create({
    user_id: userId,
    activity_type: activityType,
    timestamp: new Date()
  });
  
  await Promise.all([
    activityRepository.save(activity),
    awardPoints(userId, activityType)
  ]);

  logger.info(`Activity logged for user ${userId}: ${activityType}`);
};

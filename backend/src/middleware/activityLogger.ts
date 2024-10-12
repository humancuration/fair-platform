import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { UserActivity } from '../models/UserActivity';
import { awardPoints } from '../services/rewardsService';

export const activityLogger = (activityType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (userId) {
      await logActivity(userId, activityType);
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
  await activityRepository.save(activity);

  // Award points
  await awardPoints(userId, activityType);
};
import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';

export const trackAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Add response listener to track response metrics
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    const path = req.path;
    const method = req.method;
    const statusCode = res.statusCode;

    try {
      // Store request metrics in Redis
      await redisClient.hincrby('analytics:requests', path, 1);
      await redisClient.hincrby('analytics:response_times', path, duration);
      await redisClient.hincrby(`analytics:status_codes:${statusCode}`, path, 1);

      // Store method-specific metrics
      await redisClient.hincrby(`analytics:methods:${method}`, path, 1);

      // Expire data after 24 hours
      await redisClient.expire('analytics:requests', 86400);
      await redisClient.expire('analytics:response_times', 86400);
      await redisClient.expire(`analytics:status_codes:${statusCode}`, 86400);
      await redisClient.expire(`analytics:methods:${method}`, 86400);
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  });

  next();
};

import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import logger from '../utils/logger';

const redis = new Redis(process.env.REDIS_URL);

interface CacheOptions {
  ttl?: number;
  key?: string | ((req: Request) => string);
}

export const cache = (options: CacheOptions = {}) => {
  const ttl = options.ttl || 300; // Default 5 minutes

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = typeof options.key === 'function' 
      ? options.key(req)
      : options.key || `${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Store original send
      const originalSend = res.json;
      
      // Override res.json method
      res.json = function (body: any): Response {
        redis.setex(key, ttl, JSON.stringify(body))
          .catch(err => logger.error('Redis cache error:', err));
          
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

// Cache invalidation middleware
export const invalidateCache = (pattern: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.json;

    res.json = function (body: any): Response {
      redis.keys(pattern)
        .then(keys => keys.length > 0 && redis.del(...keys))
        .catch(err => logger.error('Cache invalidation error:', err));

      return originalSend.call(this, body);
    };

    next();
  };
};

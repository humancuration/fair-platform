import { Router } from 'express';
import { authenticateJWT } from '@middleware/auth';
import { validateRequest } from '@middleware/validation';
import { z } from 'zod';
import analyticsService from './analyticsService';
import { AnalyticsEventSchema } from './types';
import type { AggregateOptions } from './types';

const router = Router();

const AggregateQuerySchema = z.object({
  startDate: z.string().transform((str: string) => new Date(str)),
  endDate: z.string().transform((str: string) => new Date(str)),
  groupBy: z.array(z.string()).optional(),
  filters: z.record(z.any()).optional()
});

router.post('/track', 
  authenticateJWT,
  validateRequest({ body: AnalyticsEventSchema.omit({ id: true, timestamp: true }) }),
  async (req, res) => {
    const event = await analyticsService.trackEvent({
      ...req.body,
      userId: req.user?.id?.toString() || null
    });
    res.json(event);
  }
);

router.get('/aggregate',
  authenticateJWT,
  validateRequest({ query: AggregateQuerySchema }),
  async (req, res) => {
    const options: AggregateOptions = {
      startDate: new Date(req.query.startDate as string),
      endDate: new Date(req.query.endDate as string),
      groupBy: req.query.groupBy as string[],
      filters: req.query.filters as Record<string, any>
    };
    const data = await analyticsService.getAggregateData(options);
    res.json(data);
  }
);

export default router;

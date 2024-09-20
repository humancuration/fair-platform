// routes/analyticsRoutes.ts

import { Router } from 'express';
import { getLinkAnalytics } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/affiliate-links/:id/analytics', authenticateToken, getLinkAnalytics);

export default router;

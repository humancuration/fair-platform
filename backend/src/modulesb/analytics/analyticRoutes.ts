// routes/analyticsRoutes.ts

import { Router } from 'express';
import { getLinkAnalytics } from '@controllers/analyticsController';
import { authenticateJWT } from '@middleware/auth';

const router = Router();

router.get('/affiliate-links/:id/analytics', authenticateJWT, getLinkAnalytics);

export default router;

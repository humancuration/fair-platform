// routes/recommendationRoutes.ts

import { Router } from 'express';
import { getAffiliateRecommendations } from '../controllers/recommendationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/recommend', authenticateToken, getAffiliateRecommendations);

export default router;

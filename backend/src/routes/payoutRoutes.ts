// routes/payoutRoutes.ts

import { Router } from 'express';
import { initiatePayout, getPayouts } from '../controllers/payoutController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Only creators can initiate payouts
router.post('/payouts', authenticateToken, authorizeRole('creator'), initiatePayout);
router.get('/payouts', authenticateToken, authorizeRole('creator'), getPayouts);

export default router;

import { Router } from 'express';
import * as analyticsController from '@controllers/analyticsController';
import { authenticateJWT } from '@middleware/auth';

const router = Router();

// We'll assume the controller has these methods. Adjust as necessary based on what's actually in analyticsController.ts
router.get('/', authenticateJWT, analyticsController.getAnalytics);
router.post('/', authenticateJWT, analyticsController.createAnalyticsEntry);
// Add more routes as needed

export default router;
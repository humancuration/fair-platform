import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/overview', authenticateJWT, analyticsController.getOverviewAnalytics);
router.get('/events', authenticateJWT, analyticsController.getEventAnalytics);
router.post('/track', authenticateJWT, analyticsController.trackEvent);
router.get('/user/:userId', authenticateJWT, analyticsController.getUserAnalytics);
router.get('/retention', authenticateJWT, analyticsController.getRetentionAnalytics);

export default router;

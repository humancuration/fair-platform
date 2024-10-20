import { Router } from 'express';
import { authenticateJWT } from '@middleware/auth';
import * as analyticsController from './analyticsController';

const router = Router();

router.get('/overview', authenticateJWT, analyticsController.getOverviewAnalytics);
router.get('/events', authenticateJWT, analyticsController.getEventAnalytics);
router.post('/track', authenticateJWT, analyticsController.trackEvent);

export default router;

import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import {
  getMarketplaceAnalytics,
  trackRealtimeViewer,
  trackPageView
} from './marketplaceAnalyticsController';

const router = Router();

router.get('/analytics', authenticateToken, getMarketplaceAnalytics);
router.post('/analytics/viewer', trackRealtimeViewer);
router.post('/analytics/pageview', trackPageView);

export default router;

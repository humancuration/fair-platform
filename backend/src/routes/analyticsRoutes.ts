import express from 'express';
import AnalyticsController from '../controllers/AnalyticsController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post('/track', authenticateJWT, AnalyticsController.trackEvent);
router.get('/aggregate', authenticateJWT, AnalyticsController.getAggregateData);

export default router;
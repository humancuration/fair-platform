// routes/clickTrackingRoutes.ts

import { Router } from 'express';
import { handleAffiliateClick } from './clickTrackingController';

const router = Router();

// This route is public and doesn't require authentication
router.get('/:trackingCode', handleAffiliateClick);

export default router;

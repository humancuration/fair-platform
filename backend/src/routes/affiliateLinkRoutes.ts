// routes/affiliateLinkRoutes.ts

import express from 'express';
import { createAffiliateLink, getAffiliateLinks, trackAffiliateClick } from '@controllers/affiliateController';
import { authenticateJWT } from '@middleware/auth';

const router = express.Router();

router.post('/', authenticateJWT, createAffiliateLink);
router.get('/', authenticateJWT, getAffiliateLinks);
router.get('/track/:trackingCode', trackAffiliateClick);

export default router;

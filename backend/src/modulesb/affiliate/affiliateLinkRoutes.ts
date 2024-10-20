// routes/affiliateLinkRoutes.ts

import { Router } from 'express';
import { createAffiliateLink, getAffiliateLinks, trackAffiliateClick } from './affiliateController';
import { authenticateJWT } from '../../middleware/auth';
import { validateCreateAffiliateLink } from '../validators/affiliateLinkValidators';

const router = Router();

router.post('/', authenticateJWT, validateCreateAffiliateLink, createAffiliateLink);
router.get('/', authenticateJWT, getAffiliateLinks);
router.get('/track/:trackingCode', trackAffiliateClick);

export default router;

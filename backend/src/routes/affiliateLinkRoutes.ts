// routes/affiliateLinkRoutes.ts

import { Router } from 'express';
import {
  createAffiliateLink,
  getAffiliateLinks,
  // Other controller functions
} from '../controllers/affiliateLinkController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createAffiliateLink);
router.get('/', authenticateToken, getAffiliateLinks);
// Add routes for updating, deleting

export default router;

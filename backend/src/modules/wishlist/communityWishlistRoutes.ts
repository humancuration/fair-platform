import express from 'express';
import { getCommunityWishlist, highlightItem, addToCommunityWishlist, searchCommunityWishlist } from './communityWishlistController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getCommunityWishlist);
router.get('/search', searchCommunityWishlist);

// Protected routes
router.post('/highlight', authMiddleware, highlightItem);
router.post('/add', authMiddleware, addToCommunityWishlist);

export default router;

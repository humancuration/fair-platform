import express from 'express';
import { getCommunityWishlist, highlightItem, addToCommunityWishlist } from '../controllers/communityWishlistController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public route to get community wishlist
router.get('/', getCommunityWishlist);

// Protected routes
router.post('/highlight', authMiddleware, highlightItem);
router.post('/add', authMiddleware, addToCommunityWishlist);

export default router;
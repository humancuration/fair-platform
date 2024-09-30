import express from 'express';
import { getCommunityWishlist, addCommunityWishlistItem, contributeToItem } from '../controllers/communityWishlistController';
import auth from '../middleware/auth';

const router = express.Router();

// Public route to get community wishlist
router.get('/', getCommunityWishlist);

// Protected route to add an item to community wishlist
router.post('/', auth, addCommunityWishlistItem);

// Protected route to contribute to a community wishlist item
router.post('/:itemId/contribute', auth, contributeToItem);

export default router;
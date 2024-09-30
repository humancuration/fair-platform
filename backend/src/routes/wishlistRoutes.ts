import express from 'express';
import { getWishlist, addWishlistItem, updateWishlistItem } from '../controllers/wishlistController';
import auth from '../middleware/auth';

const router = express.Router();

// Get user's wishlist
router.get('/:userId/wishlist', auth, getWishlist);

// Add item to wishlist
router.post('/:userId/wishlist', auth, addWishlistItem);

// Update wishlist item (e.g., toggle public/private)
router.patch('/:userId/wishlist/:itemId', auth, updateWishlistItem);

// Add a new route to fetch public wishlist by username
router.get('/public/:username', getPublicWishlistByUsername);

export default router;
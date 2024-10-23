import express from 'express';
import {
  upsertWishlist,
  getWishlist,
  getPublicWishlistByUsername,
  addCommunityWishlistItem,
  getCommunityWishlist,
} from '../modules/wishlist/wishlistController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();

// Private Wishlist Routes
router.post('/', authMiddleware, upsertWishlist);
router.get('/:name', authMiddleware, getWishlist);

// Public Wishlist Routes
router.get('/public/:username', getPublicWishlistByUsername);

// Community Wishlist Routes
router.post('/community', authMiddleware, addCommunityWishlistItem);
router.get('/community', getCommunityWishlist);

export default router;

import express from 'express';
import {
  upsertPrivateWishlist,
  getPrivateWishlist,
  upsertPublicWishlist,
  getPublicWishlistByUsername,
  addCommunityWishlistItem,
  getCommunityWishlist,
  contributeToCommunityWishlist,
} from '../controllers/wishlistController';
import auth from '../middleware/auth';

const router = express.Router();

// Private Wishlist Routes
router.post('/private', auth, upsertPrivateWishlist);
router.get('/private', auth, getPrivateWishlist);

// Public Wishlist Routes
router.post('/public', auth, upsertPublicWishlist);
router.get('/public/:username', getPublicWishlistByUsername);

// Community Wishlist Routes
router.post('/community', auth, addCommunityWishlistItem);
router.get('/community', getCommunityWishlist);
router.post('/community/:itemId/contribute', auth, contributeToCommunityWishlist);

export default router;
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getProducts, searchProducts, getRecommendations } from '../controllers/marketplaceController';

const router = express.Router();

router.get('/products', authenticateToken, getProducts);
router.get('/search', authenticateToken, searchProducts);
router.get('/recommendations', authenticateToken, getRecommendations);

export default router;
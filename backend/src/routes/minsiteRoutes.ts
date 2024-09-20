import { Router } from 'express';
import { saveMinsite } from '../controllers/minsiteController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route POST /api/minsite/save
 * @desc Save a new minisite
 * @access Protected (Creators and Brands)
 */
router.post('/save', authenticateToken, saveMinsite);

export default router;

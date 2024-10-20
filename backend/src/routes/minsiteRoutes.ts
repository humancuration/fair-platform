import { Router } from 'express';
import { saveMinsite, getMinsite, updateMinsite, publishMinsite } from '../modulesb/minsite/minsiteController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route POST /api/minsite/save
 * @desc Save a new minisite
 * @access Protected (Creators and Brands)
 */
router.post('/save', authenticateToken, saveMinsite);

/**
 * @route GET /api/minsite/:id
 * @desc Get a minisite by ID
 * @access Protected (Creators and Brands)
 */
router.get('/:id', authenticateToken, getMinsite);

/**
 * @route PUT /api/minsite/:id
 * @desc Update a minisite
 * @access Protected (Creators and Brands)
 */
router.put('/:id', authenticateToken, updateMinsite);

/**
 * @route POST /api/minsite/:id/publish
 * @desc Publish a minisite
 * @access Protected (Creators and Brands)
 */
router.post('/:id/publish', authenticateToken, publishMinsite);

export default router;

import { Router } from 'express';
import { uploadImageHandler, uploadVideoHandler } from './uploadController';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

/**
 * @route POST /api/upload/image
 * @desc Upload an image
 * @access Protected (Authenticated Users)
 */
router.post('/image', authenticateToken, uploadImageHandler);

/**
 * @route POST /api/upload/video
 * @desc Upload a video
 * @access Protected (Authenticated Users)
 */
router.post('/video', authenticateToken, uploadVideoHandler);

export default router;

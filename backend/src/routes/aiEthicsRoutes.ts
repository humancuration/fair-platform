import express from 'express';
import { createAIEthicsCourseHandler, addReflectionActivityHandler } from '@controllers/aiEthicsController';
import { authenticateJWT } from '@/middleware/auth';

const router = express.Router();

router.post('/courses', authenticateJWT, createAIEthicsCourseHandler);
router.post('/activities', authenticateJWT, addReflectionActivityHandler);

export default router;
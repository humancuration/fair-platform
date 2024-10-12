import express from 'express';
import { createAIEthicsCourseHandler, addReflectionActivityHandler } from '@controllers/aiEthicsController';
import { authenticateJWT } from '@/iddleware/auth';

const router = express.Router();

router.post('/courses', authenticate, createAIEthicsCourseHandler);
router.post('/activities', authenticate, addReflectionActivityHandler);

export default router;
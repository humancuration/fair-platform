// routes/affiliateProgramRoutes.ts

import express from 'express';
import { createAffiliateProgram, getAffiliatePrograms } from '@controllers/affiliateProgramController';
import { authenticateJWT } from '@middleware/auth';

const router = express.Router();

router.post('/', authenticateJWT, createAffiliateProgram);
router.get('/', getAffiliatePrograms);

export default router;

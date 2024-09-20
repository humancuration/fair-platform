// routes/affiliateProgramRoutes.ts

import { Router } from 'express';
import { createAffiliateProgram, getAffiliatePrograms } from '../controllers/affiliateProgramController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// Only brands can create affiliate programs
router.post('/programs', authenticateToken, authorizeRole('brand'), createAffiliateProgram);
router.get('/programs', authenticateToken, getAffiliatePrograms);

export default router;
 
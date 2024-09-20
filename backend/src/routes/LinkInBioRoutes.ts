// routes/linkInBioRoutes.ts

import { Router } from 'express';
import { getLinkInBio } from '../controllers/linkInBioController';

const router = Router();

router.get('/:username', getLinkInBio);

export default router;

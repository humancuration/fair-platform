// routes/linkInBioRoutes.ts

import { Router } from 'express';
import { getLinkInBio } from '../modules/minsite/linkInBioController';

const router = Router();

router.get('/:username', getLinkInBio);

export default router;

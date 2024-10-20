import express from 'express';
import { createRepository, getIssues, triggerBuild } from './gitController';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/repositories', auth, createRepository);
router.get('/:owner/:repo/issues', auth, getIssues);
router.post('/build', auth, triggerBuild);

export default router;
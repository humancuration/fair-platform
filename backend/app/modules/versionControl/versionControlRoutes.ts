import express from 'express';
import { 
  initializeRepo, 
  cloneRepo, 
  addAndCommit, 
  pushChanges, 
  createBranch, 
  switchBranch, 
  getStatus, 
  getLog 
} from './versionControlService';
import { authenticateJWT } from '../../middleware/auth';
import { createRepository, getIssues, triggerBuild } from './gitController';
import { getGiteaRepos } from './giteaController';
import { getUserRepos } from './githubController';
import { uploadRouter } from './uploadController';
import { handleVersionControlError } from './errorHandler';
import logger from '../../utils/logger';
import { AuthRequest } from '../auth/types';

const router = express.Router();

router.post('/initialize', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { repoName, description } = req.body;
    await initializeRepo(repoName, description);
    logger.info(`Repository initialized: ${repoName}`);
    res.status(201).json({ message: 'Repository initialized with Git LFS support.' });
  } catch (error) {
    handleVersionControlError(res, error, 'initialize repository');
  }
});

router.post('/clone', authenticateJWT, async (req: AuthRequest, res) => {
  const { url, dir } = req.body;
  try {
    await cloneRepo(url, dir);
    res.status(200).send({ message: 'Repository cloned successfully.' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: 'Error cloning repository', error: error.message });
    } else {
      res.status(500).send({ message: 'Error cloning repository', error: String(error) });
    }
  }
});

router.post('/commit', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { dir, filepath, message } = req.body;
    const author = {
      name: req.user.username,
      email: req.user.email
    };
    await addAndCommit(dir, filepath, message, author);
    res.status(200).json({ message: 'Changes committed successfully.' });
  } catch (error) {
    handleVersionControlError(res, error, 'commit changes');
  }
});

router.post('/push', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { dir, branch = 'main' } = req.body;
    await pushChanges(dir, branch);
    res.status(200).json({ message: 'Changes pushed successfully.' });
  } catch (error) {
    handleVersionControlError(res, error, 'push changes');
  }
});

router.post('/branch', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { dir, branchName } = req.body;
    await createBranch(dir, branchName);
    res.status(201).json({ message: 'Branch created successfully.' });
  } catch (error) {
    handleVersionControlError(res, error, 'create branch');
  }
});

router.post('/switch-branch', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { dir, branchName } = req.body;
    await switchBranch(dir, branchName);
    res.status(200).json({ message: 'Switched branch successfully.' });
  } catch (error) {
    handleVersionControlError(res, error, 'switch branch');
  }
});

// Protected routes with proper typing
router.get('/gitea/repos', authenticateJWT, async (req: AuthRequest, res) => {
  if (!req.user.giteaAccessToken) {
    return res.status(401).json({ message: 'Gitea access token not found' });
  }
  await getGiteaRepos(req, res);
});

router.get('/github/repos', authenticateJWT, async (req: AuthRequest, res) => {
  if (!req.user.githubAccessToken) {
    return res.status(401).json({ message: 'GitHub access token not found' });
  }
  await getUserRepos(req, res);
});

router.use('/upload', authenticateJWT, uploadRouter);

router.get('/status/:dir', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { dir } = req.params;
    const status = await getStatus(dir);
    res.status(200).json(status);
  } catch (error) {
    handleVersionControlError(res, error, 'get status');
  }
});

router.get('/log/:dir', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { dir } = req.params;
    const depth = Number(req.query.depth) || 10;
    const log = await getLog(dir, depth);
    res.status(200).json(log);
  } catch (error) {
    handleVersionControlError(res, error, 'get log');
  }
});

export default router;

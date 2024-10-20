import express from 'express';
import { initializeRepo, cloneRepo, addAndCommit, pushChanges, createBranch, switchBranch, getStatus, getLog } from './versionControlService';
import { authenticate } from '../../middleware/auth';
import { createRepository, getIssues, triggerBuild } from './gitController';
import { getGiteaRepos } from './giteaController';
import { getUserRepos } from './githubController';
import uploadRoutes from './uploadRoutes';

const router = express.Router();

router.post('/initialize', authenticate, async (req, res) => {
  const { repoName } = req.body;
  try {
    await initializeRepo(repoName);
    res.status(201).send({ message: 'Repository initialized with Git LFS support.' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: 'Error initializing repository', error: error.message });
    } else {
      res.status(500).send({ message: 'Error initializing repository', error: String(error) });
    }
  }
});

router.post('/clone', authenticate, async (req, res) => {
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

router.post('/commit', authenticate, async (req, res) => {
  const { dir, filepath, message } = req.body;
  try {
    await addAndCommit(dir, filepath, message);
    res.status(200).send({ message: 'Changes committed successfully.' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: 'Error committing changes', error: error.message });
    } else {
      res.status(500).send({ message: 'Error committing changes', error: String(error) });
    }
  }
});

router.post('/push', authenticate, async (req, res) => {
  const { dir } = req.body;
  try {
    await pushChanges(dir);
    res.status(200).send({ message: 'Changes pushed successfully.' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: 'Error pushing changes', error: error.message });
    } else {
      res.status(500).send({ message: 'Error pushing changes', error: String(error) });
    }
  }
});

router.post('/branch', authenticate, async (req, res) => {
  const { dir, branchName } = req.body;
  try {
    await createBranch(dir, branchName);
    res.status(201).send({ message: 'Branch created successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error creating branch', error: error.message });
  }
});

router.post('/switch-branch', authenticate, async (req, res) => {
  const { dir, branchName } = req.body;
  try {
    await switchBranch(dir, branchName);
    res.status(200).send({ message: 'Switched branch successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error switching branch', error: error.message });
  }
});

router.get('/gitea/repos', authenticate, getGiteaRepos);
router.get('/github/repos', authenticate, getUserRepos);

router.use('/upload', uploadRoutes);

router.get('/status/:dir', authenticate, async (req, res) => {
  const { dir } = req.params;
  try {
    const status = await getStatus(dir);
    res.status(200).send(status);
  } catch (error) {
    res.status(500).send({ message: 'Error getting status', error: error.message });
  }
});

router.get('/log/:dir', authenticate, async (req, res) => {
  const { dir } = req.params;
  const { depth } = req.query;
  try {
    const log = await getLog(dir, Number(depth) || 10);
    res.status(200).send(log);
  } catch (error) {
    res.status(500).send({ message: 'Error getting log', error: error.message });
  }
});

export default router;

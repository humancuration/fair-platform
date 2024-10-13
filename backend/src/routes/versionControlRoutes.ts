import express from 'express';
import { initializeRepo, cloneRepo, addAndCommit, pushChanges } from '../services/versionControlService';
import { authenticate } from '../middleware/auth';

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

export default router;

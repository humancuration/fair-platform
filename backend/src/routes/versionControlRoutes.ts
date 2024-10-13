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
    res.status(500).send({ message: 'Error initializing repository', error: error.message });
  }
});

router.post('/clone', authenticate, async (req, res) => {
  const { url, dir } = req.body;
  try {
    await cloneRepo(url, dir);
    res.status(200).send({ message: 'Repository cloned successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error cloning repository', error: error.message });
  }
});

router.post('/commit', authenticate, async (req, res) => {
  const { dir, filepath, message } = req.body;
  try {
    await addAndCommit(dir, filepath, message);
    res.status(200).send({ message: 'Changes committed successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error committing changes', error: error.message });
  }
});

router.post('/push', authenticate, async (req, res) => {
  const { dir } = req.body;
  try {
    await pushChanges(dir);
    res.status(200).send({ message: 'Changes pushed successfully.' });
  } catch (error) {
    res.status(500).send({ message: 'Error pushing changes', error: error.message });
  }
});

export default router;
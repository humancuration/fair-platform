import express from 'express';
import { initializeRepo } from '../services/versionControlService';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Initialize a new repository
router.post('/initialize', authenticateJWT, async (req, res) => {
  const { repoName } = req.body;
  await initializeRepo(repoName);
  res.status(201).send({ message: 'Repository initialized.' });
});

// ... other routes like commit, push, pull

export default router;

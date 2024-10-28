import express from 'express';
import { castVote } from '../controllers/voteController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router({ mergeParams: true });

// Cast a vote on a petition
router.post('/', authenticate, castVote);

// Add more routes for updating votes, fetching vote counts, etc.

export default router;
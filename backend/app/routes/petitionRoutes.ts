import express from 'express';
import { createPetition, getPetitions, getPetitionById, updatePetition, deletePetition } from '../controllers/petitionController';
import { authenticate } from '../middleware/authenticate';
import voteRoutes from './voteRoutes';

const router = express.Router({ mergeParams: true });

// Existing petition routes
router.post('/', authenticate, createPetition);
router.get('/', authenticate, getPetitions);
router.get('/:petitionId', authenticate, getPetitionById);
router.put('/:petitionId', authenticate, updatePetition);
router.delete('/:petitionId', authenticate, deletePetition);

// Nested vote routes
router.use('/:petitionId/votes', voteRoutes);

export default router;
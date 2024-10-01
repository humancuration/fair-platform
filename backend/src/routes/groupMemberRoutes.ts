import express from 'express';
import { addMember, removeMember } from '../controllers/groupMemberController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router({ mergeParams: true });

// Add a member to a group
router.post('/', authenticate, addMember);

// Remove a member from a group
router.delete('/:userId', authenticate, removeMember);

// Add more routes for updating roles, fetching members, etc.

export default router;
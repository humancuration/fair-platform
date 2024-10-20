import express from 'express';
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  updateGroupProfile,
  searchGroups,
  addResourceCredits,
  addMember,
  removeMember,
  assignDelegate,
  revokeDelegate
} from '../controllers/groupController';
import { authenticate } from '../middleware/authenticate';
import auth from '../middleware/auth';
import groupMemberRoutes from './groupMemberRoutes';
import eventRoutes from './eventRoutes';
import projectRoutes from './projectRoutes';
import petitionRoutes from './petitionRoutes';
import resourceRoutes from './resourceRoutes';

const router = express.Router();

// Group CRUD Routes
router.post('/', authenticate, createGroup);
router.get('/', authenticate, getGroups);
router.get('/search', authenticate, searchGroups);
router.get('/:id', authenticate, getGroupById);
router.put('/:id', authenticate, updateGroup);
router.patch('/:id/profile', authenticate, updateGroupProfile);
router.delete('/:id', authenticate, deleteGroup);

// Resource Credits Route
router.post('/:id/credits', authenticate, addResourceCredits);

// Member Management Routes
router.post('/add-member', auth, addMember);
router.post('/remove-member', auth, removeMember);

// Delegate Management Routes
router.post('/assign-delegate', auth, assignDelegate);
router.post('/revoke-delegate', auth, revokeDelegate);

// Nested routes
router.use('/:groupId/members', groupMemberRoutes);
router.use('/:groupId/events', eventRoutes);
router.use('/:groupId/projects', projectRoutes);
router.use('/:groupId/petitions', petitionRoutes);
router.use('/:groupId/resources', resourceRoutes);

export default router;
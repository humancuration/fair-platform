import express from 'express';
import { createGroup, getGroups, getGroupById, updateGroup, deleteGroup, updateGroupProfile, searchGroups, addResourceCredits } from '../controllers/groupController';
import { authenticate } from '../middleware/authenticate';
import groupMemberRoutes from './groupMemberRoutes';
import eventRoutes from './eventRoutes';
import projectRoutes from './projectRoutes';
import petitionRoutes from './petitionRoutes';
import resourceRoutes from './resourceRoutes';

const router = express.Router();

// Existing group routes
router.post('/', authenticate, createGroup );
router.get('/', authenticate, getGroups );
router.get('/search', authenticate, searchGroups );
router.get('/:id', authenticate, getGroupById );
router.put('/:id', authenticate, updateGroup );
router.patch('/:id/profile', authenticate, updateGroupProfile );
router.delete('/:id', authenticate, deleteGroup );
router.post('/:id/credits', authenticate, addResourceCredits );

// Nested routes for group members
router.use('/:groupId/members', groupMemberRoutes);

// Nested routes for events
router.use('/:groupId/events', eventRoutes);

// Nested routes for projects
router.use('/:groupId/projects', projectRoutes);

// Nested routes for petitions
router.use('/:groupId/petitions', petitionRoutes);

// Nested routes for resources
router.use('/:groupId/resources', resourceRoutes);

export default router;
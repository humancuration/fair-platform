import express from 'express';
import { offerResource, fetchResources, requestResource } from '../controllers/resourceController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router({ mergeParams: true });

// Offer a new resource
router.post('/', authenticate, offerResource);

// Fetch available resources
router.get('/', authenticate, fetchResources);

// Request a resource
router.post('/:resourceId/request', authenticate, requestResource);

// Add more routes for updating resources, managing availability, etc.

export default router;
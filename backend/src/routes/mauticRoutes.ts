import express from 'express';
import { createContact, addToSegment, triggerMauticCampaign } from '../controllers/mauticController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/contacts', auth, createContact);
router.post('/segments/add', auth, addToSegment);
router.post('/campaigns/trigger', auth, triggerMauticCampaign);

export default router;
import express from 'express';
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  addReward,
  getRewardsByCampaign,
} from './campaignController';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

// Campaign CRUD Routes
router.post('/', authenticate, createCampaign);
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', authenticate, updateCampaign);
router.delete('/:id', authenticate, deleteCampaign);

// Rewards Routes
router.post('/:campaignId/rewards', authenticate, addReward);
router.get('/:campaignId/rewards', getRewardsByCampaign);

export default router;

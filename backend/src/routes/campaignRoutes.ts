import express from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from '../controllers/campaignController';
import { createContribution, handleStripeWebhook } from '../controllers/contributionController';
import { addReward, getRewardsByCampaign } from '../controllers/rewardController';
import auth from '../middleware/auth';
import bodyParser from 'body-parser';
import Stripe from 'stripe';

const router = express.Router();

// Campaign CRUD Routes
router.post('/', auth, createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', auth, updateCampaign);
router.delete('/:id', auth, deleteCampaign);

// Rewards Routes
router.post('/:campaignId/rewards', auth, addReward);
router.get('/:campaignId/rewards', getRewardsByCampaign);

// Contribution Routes
router.post('/contribute', auth, createContribution);

// Stripe Webhook Endpoint
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }), // Stripe requires raw body
  handleStripeWebhook
);

export default router;
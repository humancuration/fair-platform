import express from 'express';
import { getAvailableRewards, redeemReward, addReward, getRewardsByCampaign } from '../controllers/rewardsController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/rewards', authenticateJWT, getAvailableRewards);
router.post('/rewards/redeem', authenticateJWT, redeemReward);
router.post('/rewards', authenticateJWT, addReward);
router.get('/rewards/campaign/:campaignId', authenticateJWT, getRewardsByCampaign);

export default router;

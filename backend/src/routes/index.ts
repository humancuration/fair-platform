import { Router } from 'express';
import userRoutes from './userRoutes';
import companyRoutes from './companyRoutes';
import aiRoutes from './aiRoutes';
import brandRoutes from './brandRoutes';
import affiliateProgramRoutes from './affiliateProgramRoutes';
import affiliateLinkRoutes from './affiliateLinkRoutes';
import affiliateRoutes from './affiliateRoutes';
import clickTrackingRoutes from './clickTrackingRoutes';
import analyticsRoutes from './analyticsRoutes';
import linkInBioRoutes from './linkInBioRoutes';
import recommendationRoutes from './recommendationRoutes';
import payoutRoutes from './payoutRoutes';
import minsiteRoutes from './minsiteRoutes'; // Import the minsite routes
import uploadRoutes from './uploadRoutes'; // Import upload routes
import testimonialRoutes from './testimonialRoutes';
import wishlistRoutes from './wishlistRoutes';
import communityWishlistRoutes from './communityWishlistRoutes';
import express from 'express';
import campaignRoutes from './campaignRoutes';
import groupRoutes from './groupRoutes';
import eventRoutes from './eventRoutes';
import n8nRoutes from './n8nRoutes';
import mauticRoutes from './mauticRoutes';
import gitRoutes from './gitRoutes';
import authRoutes from './authRoutes';
import aiEthicsRoutes from './aiEthicsRoutes';

const router = express.Router();

// Import other routes
import * as campaignController from '../controllers/campaignController';

const router = Router();

// Campaign routes
router.post('/campaigns', campaignController.createCampaign);
router.get('/campaigns', campaignController.getAllCampaigns);
router.get('/campaigns/:id', campaignController.getCampaignById);
router.put('/campaigns/:id', campaignController.updateCampaign);
router.delete('/campaigns/:id', campaignController.deleteCampaign);

router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/ai', aiRoutes);
router.use('/brands', brandRoutes);
router.use('/affiliate-programs', affiliateProgramRoutes);
router.use('/affiliate-links', affiliateLinkRoutes);
router.use('/affiliate', affiliateRoutes);
router.use('/clicktrackingroutes', clickTrackingRoutes); // Public route for clicks
router.use('/analytics', analyticsRoutes);
router.use('/u', linkInBioRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/minsite', minsiteRoutes); // Use the minsite routes
router.use('/', payoutRoutes);
router.use('/upload', uploadRoutes); // Use upload routes
router.use('/testimonials', testimonialRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/community-wishlist', communityWishlistRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/groups', groupRoutes);
router.use('/events', eventRoutes);
router.use('/n8n', n8nRoutes);
router.use('/mautic', mauticRoutes);
router.use('/git', gitRoutes);
router.use('/auth', authRoutes);
router.use('/affiliate-links', affiliateLinkRoutes);
router.use('/affiliate-programs', affiliateProgramRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai-ethics', aiEthicsRoutes);
// Use other routes

export default router;
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Import route modules
import userRoutes from '../modules/user/userRoutes';
import companyRoutes from './companyRoutes';
import aiRoutes from '../modules/ai/aiRoutes';
import brandRoutes from './brandRoutes';
import affiliateProgramRoutes from '../modules/affiliate/affiliateProgramRoutes';
import affiliateLinkRoutes from '../modules/affiliate/affiliateLinkRoutes';
import affiliateRoutes from '../modules/affiliate/affiliateRoutes';
import clickTrackingRoutes from '../modules/dashboard/affiliate/clickTrackingRoutes';
import analyticsRoutes from './analyticsRoutes';
import linkInBioRoutes from './linkInBioRoutes';
import recommendationRoutes from './recommendationRoutes';
import payoutRoutes from './payoutRoutes';
import minsiteRoutes from './minsiteRoutes'; // Import the minsite routes
import uploadRoutes from '../modules/versionControl/uploadRoutes'; // Import upload routes
import testimonialRoutes from './testimonialRoutes';
import wishlistRoutes from './wishlistRoutes';
import communityWishlistRoutes from './communityWishlistRoutes';
import campaignRoutes from './campaignRoutes';
import groupRoutes from './groupRoutes';
import eventRoutes from './eventRoutes';
import n8nRoutes from './n8nRoutes';
import mauticRoutes from './mauticRoutes';
import gitRoutes from '../modules/versionControl/gitRoutes';
import authRoutes from './authRoutes';
import aiEthicsRoutes from '../modules/ai/aiEthicsRoutes';

// Use routes
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
router.use('/ai-ethics', aiEthicsRoutes);

export default router;

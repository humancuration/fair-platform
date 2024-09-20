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

// Import other routes

const router = Router();

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

// Use other routes

export default router;

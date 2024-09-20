// routes/affiliateRoutes.ts

import { Router } from 'express';
import { createAffiliateLink, getAffiliateLinks, trackAffiliateClick } from '../controllers/affiliateController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /affiliate/links:
 *   post:
 *     summary: Create a new affiliate link
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               affiliateProgramId:
 *                 type: integer
 *               originalLink:
 *                 type: string
 *               customAlias:
 *                 type: string
 *     responses:
 *       201:
 *         description: Affiliate link created successfully
 *       500:
 *         description: Internal Server Error
 */
router.post('/links', authenticateToken, createAffiliateLink);

/**
 * @swagger
 * /affiliate/links:
 *   get:
 *     summary: Get all affiliate links for the authenticated creator
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of affiliate links
 *       500:
 *         description: Internal Server Error
 */
router.get('/links', authenticateToken, getAffiliateLinks);

/**
 * @swagger
 * /affiliate/{trackingCode}:
 *   get:
 *     summary: Track and redirect affiliate link click
 *     parameters:
 *       - in: path
 *         name: trackingCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The tracking code of the affiliate link
 *     responses:
 *       302:
 *         description: Redirect to the original link
 *       404:
 *         description: Affiliate Link Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/affiliate/:trackingCode', trackAffiliateClick);

export default router;

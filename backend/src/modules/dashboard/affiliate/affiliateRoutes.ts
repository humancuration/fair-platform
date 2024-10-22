import { Router } from 'express';
import { createAffiliateLink, getAffiliateLinks, trackAffiliateClick } from './affiliateController';
import { authenticateJWT } from '../../middleware/auth';
import { validateCreateAffiliateLink } from '../validators/affiliateLinkValidators';
import { validate } from '../../middleware/validate';

const router = Router();

/**
 * @swagger
 * /api/dashboard/affiliate/links:
 *   post:
 *     summary: Create a new affiliate link
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAffiliateLink'
 *     responses:
 *       201:
 *         description: Affiliate link created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/links', authenticateJWT, validateCreateAffiliateLink, validate, createAffiliateLink);

/**
 * @swagger
 * /api/dashboard/affiliate/links:
 *   get:
 *     summary: Get all affiliate links for the authenticated creator
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of affiliate links
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/links', authenticateJWT, getAffiliateLinks);

/**
 * @swagger
 * /api/dashboard/affiliate/track/{trackingCode}:
 *   get:
 *     summary: Track and redirect affiliate link click
 *     tags: [Affiliate]
 *     parameters:
 *       - in: path
 *         name: trackingCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The tracking code of the affiliate link
 *     responses:
 *       302:
 *         description: Redirect to the original link
 *       404:
 *         description: Affiliate Link Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/track/:trackingCode', trackAffiliateClick);

export default router;

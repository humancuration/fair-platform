import { Router } from 'express';
import { createAffiliateLink, getAffiliateLinks, trackAffiliateClick } from '@controllers/affiliateController';
import { authenticateJWT } from '@middleware/auth';
import { body, param, ValidationChain } from 'express-validator';
import { validate } from '@middleware/validate';

const router = Router();

// Validation rules
const createAffiliateLinkValidation: ValidationChain[] = [
  body('affiliateProgramId').isString().notEmpty(),
  body('originalLink').isURL(),
  body('customAlias').optional().isString(),
];

const trackAffiliateClickValidation: ValidationChain[] = [
  param('trackingCode').isUUID(),
];

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
 *                 type: string
 *               originalLink:
 *                 type: string
 *                 format: uri
 *               customAlias:
 *                 type: string
 *     responses:
 *       201:
 *         description: Affiliate link created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */
router.post('/links', authenticateJWT, createAffiliateLinkValidation, validate, createAffiliateLink);

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
router.get('/links', authenticateJWT, getAffiliateLinks);

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
 *           format: uuid
 *         required: true
 *         description: The tracking code of the affiliate link
 *     responses:
 *       302:
 *         description: Redirect to the original link
 *       400:
 *         description: Invalid tracking code format
 *       404:
 *         description: Affiliate Link Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/affiliate/:trackingCode', trackAffiliateClickValidation, validate, trackAffiliateClick);

export default router;
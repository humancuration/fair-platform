// controllers/affiliateController.ts

import { Request, Response, NextFunction } from 'express';
import { AffiliateLink } from '../models/AffiliateLink';
import { AffiliateProgram } from '../models/AffiliateProgram';
import { generateTrackingCode, generateAffiliateLink } from '../utils/generateAffiliateLink';
import logger from '../utils/logger';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AffiliateLinkRepository } from '../repositories/AffiliateLinkRepository';
import { sequelize } from '../config/database';

const affiliateLinkRepo = new AffiliateLinkRepository();

export const createAffiliateLink = async (req: Request, res: Response, next: NextFunction) => {
  const { affiliateProgramId, originalLink, customAlias } = req.body;
  const creatorId = req.user?.id;

  if (!creatorId) {
    return next(new ValidationError('User not authenticated'));
  }

  const transaction = await sequelize.transaction();

  try {
    const trackingCode = generateTrackingCode();
    const baseURL = process.env.BASE_URL || 'https://yourplatform.com';
    const generatedLink = generateAffiliateLink(baseURL, trackingCode);

    const newAffiliateLink = await affiliateLinkRepo.create({
      affiliateProgramId,
      creatorId,
      originalLink,
      customAlias,
      trackingCode,
      generatedLink,
    }, { transaction });

    await transaction.commit();

    logger.info(`Affiliate link created for user ${creatorId}`);
    res.status(201).json({ message: 'Affiliate link created successfully', data: newAffiliateLink });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating affiliate link:', error);
    next(new Error('Failed to create affiliate link'));
  }
};

export const getAffiliateLinks = async (req: Request, res: Response, next: NextFunction) => {
  const creatorId = req.user?.id;
  const { page = 1, limit = 10 } = req.query;

  if (!creatorId) {
    return next(new ValidationError('User not authenticated'));
  }

  try {
    const affiliateLinks = await affiliateLinkRepo.findAllByCreator(creatorId, {
      page: Number(page),
      limit: Number(limit),
      include: [{ model: AffiliateProgram }],
    });

    res.status(200).json(affiliateLinks);
  } catch (error) {
    logger.error('Error fetching affiliate links:', error);
    next(error);
  }
};

export const trackAffiliateClick = async (req: Request, res: Response, next: NextFunction) => {
  const { trackingCode } = req.params;

  try {
    const affiliateLink = await affiliateLinkRepo.findByTrackingCode(trackingCode);

    if (!affiliateLink) {
      return next(new NotFoundError('Affiliate Link Not Found'));
    }

    await affiliateLinkRepo.incrementClicks(affiliateLink.id);

    res.redirect(affiliateLink.originalLink);
  } catch (error) {
    logger.error('Error tracking affiliate click:', error);
    next(error);
  }
};

// Add more controller methods as needed

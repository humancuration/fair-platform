// controllers/affiliateController.ts

import { Request, Response } from 'express';
import AffiliateLink from '../models/AffiliateLink';
import { generateTrackingCode, generateAffiliateLink } from '../utils/generateAffiliateLink';

export const createAffiliateLink = async (req: Request, res: Response) => {
  const { affiliateProgramId, originalLink, customAlias } = req.body;
  const creatorId = req.user.id; // Assuming authentication middleware sets req.user

  try {
    const trackingCode = generateTrackingCode();
    const baseURL = process.env.BASE_URL || 'https://yourplatform.com';
    const generatedLink = generateAffiliateLink(baseURL, trackingCode);

    const newAffiliateLink = await AffiliateLink.create({
      affiliateProgramId,
      creatorId,
      originalLink,
      customAlias,
      trackingCode,
      generatedLink,
    });

    res.status(201).json(newAffiliateLink);
  } catch (error) {
    console.error('Error creating affiliate link:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAffiliateLinks = async (req: Request, res: Response) => {
  const creatorId = req.user.id;

  try {
    const affiliateLinks = await AffiliateLink.findAll({
      where: { creatorId },
      include: [{ model: AffiliateProgram }],
    });

    res.status(200).json(affiliateLinks);
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const trackAffiliateClick = async (req: Request, res: Response) => {
  const { trackingCode } = req.params;

  try {
    const affiliateLink = await AffiliateLink.findOne({ where: { trackingCode } });

    if (!affiliateLink) {
      return res.status(404).json({ message: 'Affiliate Link Not Found' });
    }

    // Increment click count
    affiliateLink.clicks += 1;
    await affiliateLink.save();

    // Redirect to the original link
    res.redirect(affiliateLink.originalLink);
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// controllers/affiliateLinkController.ts

import { Request, Response } from 'express';
import AffiliateLink from '@models/AffiliateLink';
import AffiliateProgram from '@models/AffiliateProgram';
import { v4 as uuidv4 } from 'uuid';

// Create Affiliate Link
export const createAffiliateLink = async (req: Request, res: Response) => {
  try {
    const { affiliateProgramId, originalLink, customAlias } = req.body;
    const creatorId = req.user.id; // Assuming authentication middleware sets req.user

    const affiliateProgram = await AffiliateProgram.findByPk(affiliateProgramId);
    if (!affiliateProgram) {
      return res.status(404).json({ message: 'Affiliate Program not found' });
    }

    const trackingCode = uuidv4();
    const generatedLink = `${process.env.BASE_URL}/a/${trackingCode}`;

    const affiliateLink = await AffiliateLink.create({
      affiliateProgramId,
      creatorId,
      originalLink,
      customAlias,
      trackingCode,
      generatedLink,
    });

    return res.status(201).json(affiliateLink);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get All Affiliate Links for a Creator
export const getAffiliateLinks = async (req: Request, res: Response) => {
  try {
    const creatorId = req.user.id;

    const affiliateLinks = await AffiliateLink.findAll({
      where: { creatorId },
      include: [AffiliateProgram],
    });

    res.json(affiliateLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add more controller functions for updating, deleting, etc.
// controllers/clickTrackingController.ts

import { Request, Response } from 'express';
import AffiliateLink from '@models/AffiliateLink';
import ClickTracking from '@models/ClickTracking';

export const handleAffiliateClick = async (req: Request, res: Response) => {
  try {
    const { trackingCode } = req.params;

    const affiliateLink = await AffiliateLink.findOne({
      where: { trackingCode },
    });

    if (!affiliateLink) {
      return res.status(404).json({ message: 'Affiliate Link not found' });
    }

    // Log the click
    await ClickTracking.create({
      affiliateLinkId: affiliateLink.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    // Redirect to the original link
    return res.redirect(affiliateLink.originalLink); // Ensure to return the response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' }); // Ensure to return the response
  }
};

// controllers/analyticsController.ts

import { Request, Response } from 'express';
import ClickTracking from '../models/ClickTracking';
import AffiliateLink from '../models/AffiliateLink';
import { Op } from 'sequelize';

export const getLinkAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const affiliateLink = await AffiliateLink.findByPk(id);
    if (!affiliateLink) {
      return res.status(404).json({ message: 'Affiliate Link not found' });
    }

    const whereClause: any = { affiliateLinkId: id };
    if (startDate && endDate) {
      whereClause.clickedAt = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      };
    }

    const clickCount = await ClickTracking.count({ where: whereClause });
    const clickDetails = await ClickTracking.findAll({ where: whereClause });

    res.json({
      clickCount,
      clickDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

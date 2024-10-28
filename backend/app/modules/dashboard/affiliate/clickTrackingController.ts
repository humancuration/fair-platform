// controllers/clickTrackingController.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../utils/errors';
import { createLogger } from '../../../utils/logger';

const prisma = new PrismaClient();
const logger = createLogger('ClickTrackingController');

export const handleAffiliateClick = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.params;

  try {
    const affiliateLink = await prisma.affiliateLink.findUnique({
      where: { code },
      select: {
        id: true,
        url: true,
      },
    });

    if (!affiliateLink) {
      return next(new AppError('Affiliate link not found', 404));
    }

    // Log the click
    await prisma.clickTracking.create({
      data: {
        affiliateLink: {
          connect: { id: affiliateLink.id },
        },
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || 'Unknown',
        clickedAt: new Date(),
      },
    });

    logger.info(`Click recorded for affiliate link ${affiliateLink.id}`);
    return res.redirect(affiliateLink.url);
  } catch (error) {
    logger.error('Error handling affiliate click:', error);
    return next(error);
  }
};

export const getClickStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { linkId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    // Verify link ownership
    const link = await prisma.affiliateLink.findFirst({
      where: {
        id: Number(linkId),
        userId,
      },
    });

    if (!link) {
      return next(new AppError('Affiliate link not found or unauthorized', 404));
    }

    const clicks = await prisma.clickTracking.findMany({
      where: {
        affiliateLinkId: Number(linkId),
      },
      select: {
        clickedAt: true,
        ipAddress: true,
        userAgent: true,
      },
      orderBy: {
        clickedAt: 'desc',
      },
    });

    // Group clicks by date
    const clicksByDate = clicks.reduce((acc, click) => {
      const date = click.clickedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.status(200).json({
      data: {
        totalClicks: clicks.length,
        clicksByDate,
        recentClicks: clicks.slice(0, 10),
      },
    });
  } catch (error) {
    logger.error('Error fetching click stats:', error);
    next(error);
  }
};

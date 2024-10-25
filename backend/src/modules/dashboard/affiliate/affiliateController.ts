// controllers/affiliateController.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { generateTrackingCode } from '../../../utils/generateAffiliateLink';
import { createLogger } from '../../../utils/logger';
import { AppError } from '../../../utils/errors';

const prisma = new PrismaClient();
const logger = createLogger('AffiliateController');

interface CreateAffiliateLinkDTO {
  programId: number;
  originalUrl: string;
  customAlias?: string;
}

export const createAffiliateLink = async (req: Request, res: Response, next: NextFunction) => {
  const { programId, originalUrl, customAlias } = req.body as CreateAffiliateLinkDTO;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    // Validate affiliate program exists
    const program = await prisma.affiliateProgram.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return next(new AppError('Affiliate program not found', 404));
    }

    // Generate tracking code
    const code = generateTrackingCode();
    const baseURL = process.env.BASE_URL || 'https://yourplatform.com';
    const url = `${baseURL}/affiliate/${code}`;

    const newAffiliateLink = await prisma.affiliateLink.create({
      data: {
        code,
        url,
        user: { connect: { id: userId } },
        program: { connect: { id: programId } },
      },
      include: {
        program: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    logger.info(`Affiliate link created for user ${userId}`);
    res.status(201).json({
      message: 'Affiliate link created successfully',
      data: newAffiliateLink,
    });
  } catch (error) {
    logger.error('Error creating affiliate link:', error);
    next(error);
  }
};

export const getAffiliateLinks = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const [affiliateLinks, total] = await Promise.all([
      prisma.affiliateLink.findMany({
        where: { userId },
        include: {
          program: true,
          clicks: true,
          payouts: {
            select: {
              amount: true,
              status: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.affiliateLink.count({
        where: { userId },
      }),
    ]);

    const linksWithStats = affiliateLinks.map(link => ({
      ...link,
      clickCount: link.clicks.length,
      clicks: undefined, // Remove the clicks array from response
    }));

    res.status(200).json({
      data: linksWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching affiliate links:', error);
    next(error);
  }
};

export const trackAffiliateClick = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.params;

  try {
    const affiliateLink = await prisma.affiliateLink.findUnique({
      where: { code },
      select: { url: true, id: true },
    });

    if (!affiliateLink) {
      return next(new AppError('Affiliate link not found', 404));
    }

    // Record the click
    await prisma.clickTracking.create({
      data: {
        affiliateLink: { connect: { id: affiliateLink.id } },
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
      },
    });

    res.redirect(affiliateLink.url);
  } catch (error) {
    logger.error('Error tracking affiliate click:', error);
    next(error);
  }
};

export const getAffiliateStats = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const links = await prisma.affiliateLink.findMany({
      where: { userId },
      include: {
        clicks: true,
        payouts: {
          where: {
            status: 'completed',
          },
          select: {
            amount: true,
          },
        },
      },
    });

    const stats = links.map(link => ({
      id: link.id,
      clickCount: link.clicks.length,
      earnings: link.payouts.reduce((sum, payout) => sum + payout.amount, 0),
    }));

    const totalClicks = stats.reduce((sum, link) => sum + link.clickCount, 0);
    const totalEarnings = stats.reduce((sum, link) => sum + link.earnings, 0);

    res.status(200).json({
      totalLinks: stats.length,
      totalClicks,
      totalEarnings,
      linkStats: stats,
    });
  } catch (error) {
    logger.error('Error fetching affiliate stats:', error);
    next(error);
  }
};

// Add more controller methods as needed

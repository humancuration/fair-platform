// controllers/affiliateLinkController.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../../../utils/errors';
import { createLogger } from '../../../utils/logger';
import { generateTrackingCode } from '../../../utils/generateAffiliateLink';

const prisma = new PrismaClient();
const logger = createLogger('AffiliateLinkController');

interface CreateAffiliateLinkDTO {
  programId: number;
  originalUrl: string;
  customAlias?: string;
}

interface UpdateAffiliateLinkDTO {
  customAlias?: string;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Create a new affiliate link
 */
export const createAffiliateLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { programId, originalUrl, customAlias } = req.body as CreateAffiliateLinkDTO;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const program = await prisma.affiliateProgram.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return next(new AppError('Affiliate program not found', 404));
    }

    const code = generateTrackingCode();
    const baseURL = process.env.BASE_URL || 'https://yourplatform.com';
    const url = `${baseURL}/affiliate/${code}`;

    const affiliateLink = await prisma.affiliateLink.create({
      data: {
        code,
        url,
        customAlias,
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

    return res.status(201).json({
      message: 'Affiliate link created successfully',
      data: affiliateLink,
    });
  } catch (error) {
    logger.error('Error creating affiliate link:', error);
    return next(error);
  }
};

/**
 * Get all affiliate links for a creator
 */
export const getAffiliateLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const [links, total] = await Promise.all([
      prisma.affiliateLink.findMany({
        where: { userId },
        include: {
          program: true,
          clicks: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.affiliateLink.count({
        where: { userId },
      }),
    ]);

    const linksWithStats = links.map(link => ({
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

/**
 * Update an existing affiliate link
 */
export const updateAffiliateLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const updateData = req.body as UpdateAffiliateLinkDTO;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const existingLink = await prisma.affiliateLink.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!existingLink) {
      return next(new AppError('Affiliate link not found or unauthorized', 404));
    }

    const updatedLink = await prisma.affiliateLink.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        program: true,
        clicks: true,
      },
    });

    const linkWithStats = {
      ...updatedLink,
      clickCount: updatedLink.clicks.length,
      clicks: undefined,
    };

    logger.info(`Affiliate link ${id} updated by user ${userId}`);
    res.status(200).json({
      message: 'Affiliate link updated successfully',
      data: linkWithStats,
    });
  } catch (error) {
    logger.error('Error updating affiliate link:', error);
    next(error);
  }
};

/**
 * Bulk update affiliate links
 */
export const bulkUpdateAffiliateLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { linkIds, updates } = req.body as { linkIds: number[]; updates: UpdateAffiliateLinkDTO };
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const links = await prisma.affiliateLink.findMany({
      where: {
        id: { in: linkIds },
        userId,
      },
    });

    if (links.length !== linkIds.length) {
      return next(new AppError('One or more links not found or unauthorized', 404));
    }

    const updatePromises = links.map(link =>
      prisma.affiliateLink.update({
        where: { id: link.id },
        data: updates,
      })
    );

    await Promise.all(updatePromises);

    logger.info(`Bulk update completed for ${linkIds.length} links by user ${userId}`);
    res.status(200).json({
      message: 'Bulk update completed successfully',
      updatedCount: linkIds.length,
    });
  } catch (error) {
    logger.error('Error performing bulk update:', error);
    next(error);
  }
};

/**
 * Delete an affiliate link
 */
export const deleteAffiliateLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    // Verify link ownership
    const existingLink = await prisma.affiliateLink.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!existingLink) {
      return next(new AppError('Affiliate link not found or unauthorized', 404));
    }

    // Delete the link
    await prisma.affiliateLink.delete({
      where: { id: Number(id) },
    });

    logger.info(`Affiliate link ${id} deleted by user ${userId}`);
    res.status(200).json({
      message: 'Affiliate link deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting affiliate link:', error);
    next(error);
  }
};

/**
 * Get detailed analytics for a specific affiliate link
 */
export const getLinkAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const linkAnalytics = await prisma.affiliateLink.findFirst({
      where: {
        id: Number(id),
        userId,
      },
      include: {
        clicks: {
          select: {
            clickedAt: true,
            ipAddress: true,
            userAgent: true,
          },
        },
        payouts: {
          select: {
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!linkAnalytics) {
      return next(new AppError('Affiliate link not found or unauthorized', 404));
    }

    // Calculate analytics
    const totalClicks = linkAnalytics.clicks.length;
    const totalEarnings = linkAnalytics.payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    // Group clicks by date for time-series data
    const clicksByDate = linkAnalytics.clicks.reduce((acc, click) => {
      const date = click.clickedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.status(200).json({
      data: {
        linkId: linkAnalytics.id,
        totalClicks,
        totalEarnings,
        clicksByDate,
        recentClicks: linkAnalytics.clicks.slice(-10),
        recentPayouts: linkAnalytics.payouts.slice(-5),
      },
    });
  } catch (error) {
    logger.error('Error fetching link analytics:', error);
    next(error);
  }
};

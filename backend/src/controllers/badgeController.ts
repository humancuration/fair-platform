import { Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';
import { AuthenticatedRequest } from '../types/auth';
import { createNotification } from './notificationController';

export const awardBadge = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, badgeType, reason } = req.body;
    const adminId = req.user?.id;

    if (!adminId || req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admins can award badges' });
    }

    const badge = await prisma.userBadge.create({
      data: {
        userId,
        type: badgeType,
        awardedById: adminId,
        reason
      },
      include: {
        user: {
          select: {
            username: true
          }
        },
        awardedBy: {
          select: {
            username: true
          }
        }
      }
    });

    // Notify user about new badge
    await createNotification(
      userId,
      'BADGE_AWARDED',
      `You've been awarded the ${badgeType} badge!`
    );

    res.status(201).json(badge);
  } catch (error) {
    logger.error('Error awarding badge:', error);
    res.status(500).json({ message: 'Failed to award badge' });
  }
};

export const getUserBadges = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const badges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        awardedBy: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(badges);
  } catch (error) {
    logger.error('Error fetching user badges:', error);
    res.status(500).json({ message: 'Failed to fetch badges' });
  }
};

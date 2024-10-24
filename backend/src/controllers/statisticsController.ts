import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const getUserStatistics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [
      eventCount,
      groupCount,
      affiliateStats,
      campaignStats
    ] = await Promise.all([
      prisma.event.count({
        where: {
          OR: [
            { createdById: userId },
            { attendees: { some: { id: userId } } }
          ]
        }
      }),
      prisma.groupMember.count({
        where: { userId }
      }),
      prisma.affiliateLink.aggregate({
        where: { creatorId: userId },
        _sum: {
          conversions: true
        },
        _count: true
      }),
      prisma.campaignParticipant.count({
        where: { userId }
      })
    ]);

    const totalEarnings = await prisma.payout.aggregate({
      where: {
        affiliateLink: {
          creatorId: userId
        },
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    });

    res.json({
      events: {
        total: eventCount
      },
      groups: {
        total: groupCount
      },
      affiliates: {
        totalLinks: affiliateStats._count,
        totalConversions: affiliateStats._sum.conversions || 0,
        totalEarnings: totalEarnings._sum.amount || 0
      },
      campaigns: {
        participated: campaignStats
      }
    });
  } catch (error) {
    logger.error('Error fetching user statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

export const getPlatformStatistics = async (req: Request, res: Response) => {
  try {
    const [
      userCount,
      eventCount,
      groupCount,
      campaignCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.group.count(),
      prisma.campaign.count()
    ]);

    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          {
            events: {
              some: {
                date: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
            }
          },
          {
            groups: {
              some: {
                joinedAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
            }
          }
        ]
      }
    });

    res.json({
      users: {
        total: userCount,
        active: activeUsers
      },
      events: {
        total: eventCount
      },
      groups: {
        total: groupCount
      },
      campaigns: {
        total: campaignCount
      }
    });
  } catch (error) {
    logger.error('Error fetching platform statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

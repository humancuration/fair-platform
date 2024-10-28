// controllers/recommendationController.ts

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const getPersonalizedRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get user's interests based on their group memberships
    const userGroups = await prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: true
      }
    });

    // Get events from similar groups
    const recommendedEvents = await prisma.event.findMany({
      where: {
        groupId: {
          in: userGroups.map(ug => ug.groupId)
        },
        date: {
          gte: new Date()
        }
      },
      include: {
        group: true,
        createdBy: {
          select: {
            username: true
          }
        }
      },
      take: 5,
      orderBy: {
        date: 'asc'
      }
    });

    // Get recommended affiliate programs
    const recommendedPrograms = await prisma.affiliateProgram.findMany({
      where: {
        affiliateLinks: {
          some: {
            creatorId: userId
          }
        }
      },
      take: 3
    });

    res.json({
      events: recommendedEvents,
      programs: recommendedPrograms
    });
  } catch (error) {
    logger.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};

export const getGroupRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get user's current groups
    const userGroups = await prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true }
    });

    // Find groups with similar members but user is not part of
    const recommendedGroups = await prisma.group.findMany({
      where: {
        AND: [
          {
            members: {
              some: {
                userId: {
                  in: (await prisma.groupMember.findMany({
                    where: {
                      groupId: {
                        in: userGroups.map(g => g.groupId)
                      }
                    },
                    select: { userId: true }
                  })).map(m => m.userId)
                }
              }
            }
          },
          {
            id: {
              notIn: userGroups.map(g => g.groupId)
            }
          }
        ]
      },
      include: {
        _count: {
          select: { members: true }
        }
      },
      take: 5
    });

    res.json(recommendedGroups);
  } catch (error) {
    logger.error('Error getting group recommendations:', error);
    res.status(500).json({ message: 'Failed to get group recommendations' });
  }
};

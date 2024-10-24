import { Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';
import { AuthenticatedRequest } from '../types/auth';

export const getEventAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: true,
        group: true,
        _count: {
          select: {
            attendees: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user has permission to view analytics
    const userRole = await prisma.groupMember.findFirst({
      where: {
        userId,
        groupId: event.groupId
      }
    });

    if (!userRole || !['ADMIN', 'DELEGATE'].includes(userRole.role)) {
      return res.status(403).json({ message: 'Unauthorized to view analytics' });
    }

    const analytics = {
      totalAttendees: event._count.attendees,
      attendeeGrowth: await getAttendeeGrowth(eventId),
      engagementRate: await calculateEngagementRate(eventId),
      demographics: await getAttendeeDemographics(eventId)
    };

    res.json(analytics);
  } catch (error) {
    logger.error('Error fetching event analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

async function getAttendeeGrowth(eventId: string) {
  const attendees = await prisma.eventAttendee.findMany({
    where: { eventId },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true }
  });

  const growth = attendees.reduce((acc: Record<string, number>, curr) => {
    const date = curr.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(growth).map(([date, count]) => ({
    date,
    count
  }));
}

async function calculateEngagementRate(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      group: {
        include: {
          _count: {
            select: {
              members: true
            }
          }
        }
      },
      _count: {
        select: {
          attendees: true
        }
      }
    }
  });

  if (!event || !event.group) {
    return 0;
  }

  return (event._count.attendees / event.group._count.members) * 100;
}

async function getAttendeeDemographics(eventId: string) {
  const attendees = await prisma.eventAttendee.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          role: true,
          groups: {
            select: {
              role: true
            }
          }
        }
      }
    }
  });

  const demographics = attendees.reduce((acc: Record<string, number>, curr) => {
    const role = curr.user.role;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(demographics).map(([role, count]) => ({
    role,
    count
  }));
}

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';
import { createNotification } from './notificationController';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const createCampaign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, startDate, endDate, rewardPoints } = req.body;
    const creatorId = req.user?.id;

    if (!creatorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rewardPoints: parseInt(rewardPoints),
        creatorId
      }
    });

    // Notify relevant users about the new campaign
    const groupMembers = await prisma.groupMember.findMany({
      where: {
        group: {
          members: {
            some: {
              userId: creatorId
            }
          }
        }
      },
      select: {
        userId: true
      }
    });

    // Create notifications for group members
    await Promise.all(
      groupMembers.map(member => 
        createNotification(
          member.userId,
          'NEW_CAMPAIGN',
          `New campaign "${name}" has been created!`
        )
      )
    );

    res.status(201).json(campaign);
  } catch (error) {
    logger.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Failed to create campaign' });
  }
};

export const getCampaignMetrics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        participants: true,
        rewards: {
          include: {
            recipient: true
          }
        }
      }
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const metrics = {
      totalParticipants: campaign.participants.length,
      totalRewardsIssued: campaign.rewards.length,
      totalPointsAwarded: campaign.rewards.reduce((sum, reward) => sum + reward.points, 0),
      isActive: new Date() >= campaign.startDate && new Date() <= campaign.endDate
    };

    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching campaign metrics:', error);
    res.status(500).json({ message: 'Failed to fetch campaign metrics' });
  }
};

export const joinCampaign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (new Date() > campaign.endDate) {
      return res.status(400).json({ message: 'Campaign has ended' });
    }

    await prisma.campaignParticipant.create({
      data: {
        campaignId,
        userId,
        joinedAt: new Date()
      }
    });

    await createNotification(
      campaign.creatorId,
      'NEW_PARTICIPANT',
      `A new participant has joined your campaign "${campaign.name}"`
    );

    res.json({ message: 'Successfully joined campaign' });
  } catch (error) {
    logger.error('Error joining campaign:', error);
    res.status(500).json({ message: 'Failed to join campaign' });
  }
};

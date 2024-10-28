import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../types/auth';
import logger from '../utils/logger';
import { createNotification } from './notificationController';

export const createPetition = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, goal, category } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const petition = await prisma.petition.create({
      data: {
        title,
        description,
        goal: parseInt(goal),
        category,
        status: 'ACTIVE',
        creatorId: userId
      },
      include: {
        creator: {
          select: {
            username: true
          }
        }
      }
    });

    // Notify relevant users about new petition
    const interestedUsers = await prisma.user.findMany({
      where: {
        groups: {
          some: {
            group: {
              members: {
                some: {
                  userId
                }
              }
            }
          }
        }
      }
    });

    await Promise.all(
      interestedUsers.map(user =>
        createNotification(
          user.id,
          'NEW_PETITION',
          `New petition created: ${title}`
        )
      )
    );

    res.status(201).json(petition);
  } catch (error) {
    logger.error('Error creating petition:', error);
    res.status(500).json({ message: 'Failed to create petition' });
  }
};

export const signPetition = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { petitionId } = req.params;
    const userId = req.user?.id;
    const { comment } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existingSignature = await prisma.petitionSignature.findFirst({
      where: {
        petitionId,
        userId
      }
    });

    if (existingSignature) {
      return res.status(400).json({ message: 'You have already signed this petition' });
    }

    const signature = await prisma.petitionSignature.create({
      data: {
        petitionId,
        userId,
        comment
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    const petition = await prisma.petition.findUnique({
      where: { id: petitionId },
      include: {
        _count: {
          select: { signatures: true }
        }
      }
    });

    if (petition?._count.signatures >= petition.goal) {
      await prisma.petition.update({
        where: { id: petitionId },
        data: { status: 'GOAL_REACHED' }
      });

      await createNotification(
        petition.creatorId,
        'PETITION_GOAL_REACHED',
        `Your petition "${petition.title}" has reached its goal!`
      );
    }

    res.json(signature);
  } catch (error) {
    logger.error('Error signing petition:', error);
    res.status(500).json({ message: 'Failed to sign petition' });
  }
};

export const getPetitions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, category } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const petitions = await prisma.petition.findMany({
      where: {
        ...(status ? { status: status as string } : {}),
        ...(category ? { category: category as string } : {})
      },
      include: {
        creator: {
          select: {
            username: true
          }
        },
        _count: {
          select: { signatures: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(petitions);
  } catch (error) {
    logger.error('Error fetching petitions:', error);
    res.status(500).json({ message: 'Failed to fetch petitions' });
  }
};

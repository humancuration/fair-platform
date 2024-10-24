import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: User;
}

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            groups: true,
            events: true,
            affiliateLinks: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    logger.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, username } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        username
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        updatedAt: true
      }
    });

    res.json(updatedProfile);
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const profile = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        _count: {
          select: {
            groups: true,
            events: true,
            affiliateLinks: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    logger.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const group = await prisma.group.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId,
            role: 'ADMIN'
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                username: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(group);
  } catch (error) {
    logger.error('Error creating group:', error);
    res.status(500).json({ message: 'Failed to create group' });
  }
};

export const getGroupMembers = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    const members = await prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    res.json(members);
  } catch (error) {
    logger.error('Error fetching group members:', error);
    res.status(500).json({ message: 'Failed to fetch group members' });
  }
};

export const updateGroupMemberRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId, memberId } = req.params;
    const { role } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const adminMember = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        role: 'ADMIN'
      }
    });

    if (!adminMember) {
      return res.status(403).json({ message: 'Only group admins can update roles' });
    }

    const updatedMember = await prisma.groupMember.update({
      where: {
        id: memberId
      },
      data: { role },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    res.json(updatedMember);
  } catch (error) {
    logger.error('Error updating member role:', error);
    res.status(500).json({ message: 'Failed to update member role' });
  }
};

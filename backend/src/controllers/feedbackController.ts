import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';
import { createNotification } from './notificationController';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

interface FeedbackData {
  type: 'BUG' | 'FEATURE' | 'GENERAL';
  title: string;
  description: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  category?: string;
}

export const submitFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const feedbackData: FeedbackData = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        ...feedbackData,
        userId,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    // Notify admins about new feedback
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    await Promise.all(
      admins.map(admin =>
        createNotification(
          admin.id,
          'NEW_FEEDBACK',
          `New ${feedbackData.type.toLowerCase()} feedback: ${feedbackData.title}`
        )
      )
    );

    res.status(201).json(feedback);
  } catch (error) {
    logger.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};

export const getFeedbackList = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { type, status } = req.query;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    const where = {
      ...(user?.role !== 'ADMIN' ? { userId } : {}),
      ...(type ? { type: type as string } : {}),
      ...(status ? { status: status as string } : {})
    };

    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(feedback);
  } catch (error) {
    logger.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
};

export const updateFeedbackStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admins can update feedback status' });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { status },
      include: {
        user: true
      }
    });

    // Notify the feedback creator about the status update
    await createNotification(
      updatedFeedback.userId,
      'FEEDBACK_STATUS_UPDATE',
      `Your feedback "${updatedFeedback.title}" status has been updated to ${status}`
    );

    res.json(updatedFeedback);
  } catch (error) {
    logger.error('Error updating feedback status:', error);
    res.status(500).json({ message: 'Failed to update feedback status' });
  }
};

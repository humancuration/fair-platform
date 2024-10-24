import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';
import { io } from '../socket/server';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        read: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    res.json(notifications);
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId // Ensure the notification belongs to the user
      },
      data: {
        read: true
      }
    });

    res.json(notification);
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
};

export const createNotification = async (userId: string, type: string, content: string) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        content,
        read: false
      }
    });

    // Emit socket event for real-time notifications
    io.to(userId).emit('newNotification', notification);

    return notification;
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw error;
  }
};

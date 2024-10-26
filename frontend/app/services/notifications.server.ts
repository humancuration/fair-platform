import { prisma } from '~/utils/db.server';
import type { Socket } from 'socket.io';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'share' | 'collaboration' | 'addition' | 'mention';
  userId: string;
  targetId: string;
  targetType: 'playlist' | 'track' | 'user';
  content: string;
  read: boolean;
  createdAt: Date;
}

export async function createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
  return prisma.notification.create({
    data: {
      ...data,
      read: false,
    },
  });
}

export async function markAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

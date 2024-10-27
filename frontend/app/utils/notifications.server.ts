import { prisma } from "~/db.server";
import type { Notification, NotificationType } from "@prisma/client";

interface NotificationMetadata {
  targetId?: string;
  targetType?: 'playlist' | 'track' | 'user' | 'event' | 'group' | 'campaign';
  [key: string]: unknown;
}

export async function createNotification({
  userId,
  type,
  message,
  metadata = {},
}: {
  userId: number;
  type: NotificationType;
  message: string;
  metadata?: NotificationMetadata;
}) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      message,
      metadata,
    },
  });
}

export async function getUnreadCount(userId: number) {
  return prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });
}

export async function markAsRead(notificationId: number) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function getUserNotifications(userId: number) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export async function markAllAsRead(userId: number) {
  return prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  });
}

export async function deleteNotification(notificationId: number) {
  return prisma.notification.delete({
    where: { id: notificationId },
  });
}

export async function getNotificationsByType(userId: number, type: NotificationType) {
  return prisma.notification.findMany({
    where: {
      userId,
      type,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
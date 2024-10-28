import { prisma } from "~/db.server";
import type { SocialStats, Comment, NotificationPreference, PlaylistNotification } from "~/types/social";

export async function getSocialStats(playlistId: string): Promise<SocialStats> {
  const stats = await prisma.playlistSocialStats.findUnique({
    where: { playlistId }
  });

  return {
    likes: stats?.likes || 0,
    comments: stats?.comments || 0,
    shares: stats?.shares || 0,
    saves: stats?.saves || 0,
    isLiked: Boolean(stats?.isLiked),
    isSaved: Boolean(stats?.isSaved)
  };
}

export async function getComments(playlistId: string): Promise<Comment[]> {
  return prisma.playlistComment.findMany({
    where: { playlistId },
    orderBy: { timestamp: 'desc' },
    include: {
      user: {
        select: {
          username: true,
          avatar: true
        }
      }
    }
  });
}

export async function addComment(playlistId: string, userId: string, content: string) {
  return prisma.playlistComment.create({
    data: {
      playlistId,
      userId,
      content
    }
  });
}

export async function getNotificationPreferences(userId: string): Promise<NotificationPreference> {
  const prefs = await prisma.userNotificationPreferences.findUnique({
    where: { userId }
  });

  return {
    email: Boolean(prefs?.email),
    push: Boolean(prefs?.push),
    inApp: Boolean(prefs?.inApp)
  };
}

export async function updateNotificationPreferences(
  userId: string, 
  preferences: Partial<NotificationPreference>
) {
  return prisma.userNotificationPreferences.update({
    where: { userId },
    data: preferences
  });
}

export async function getNotifications(playlistId: string): Promise<PlaylistNotification[]> {
  return prisma.playlistNotification.findMany({
    where: { playlistId },
    orderBy: { timestamp: 'desc' },
    include: {
      user: {
        select: {
          username: true,
          avatar: true
        }
      }
    }
  });
}

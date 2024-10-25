import { PrismaClient } from '@prisma/client';
import type { Achievement, UserAchievement, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export type AchievementCreate = Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>;
export type AchievementUpdate = Partial<AchievementCreate>;

export const AchievementModel = {
  create: async (data: AchievementCreate): Promise<Achievement> => {
    return prisma.achievement.create({ data });
  },

  findById: async (id: string): Promise<Achievement | null> => {
    return prisma.achievement.findUnique({
      where: { id },
      include: {
        userAchievements: true,
        users: true
      }
    });
  },

  findAll: async (): Promise<Achievement[]> => {
    return prisma.achievement.findMany({
      include: {
        userAchievements: true,
        users: true
      }
    });
  },

  update: async (id: string, data: AchievementUpdate): Promise<Achievement> => {
    return prisma.achievement.update({
      where: { id },
      data,
      include: {
        userAchievements: true,
        users: true
      }
    });
  },

  delete: async (id: string): Promise<Achievement> => {
    return prisma.achievement.delete({ where: { id } });
  },

  getUserAchievements: async (achievementId: string): Promise<UserAchievement[]> => {
    return prisma.userAchievement.findMany({
      where: { achievementId },
      include: {
        user: true,
        achievement: true
      }
    });
  },

  // Add new methods for achievement management
  awardToUser: async (achievementId: string, userId: number): Promise<UserAchievement> => {
    return prisma.userAchievement.create({
      data: {
        achievementId,
        userId,
        earnedAt: new Date()
      },
      include: {
        user: true,
        achievement: true
      }
    });
  },

  checkUserProgress: async (userId: number): Promise<Achievement[]> => {
    return prisma.achievement.findMany({
      where: {
        userAchievements: {
          none: {
            userId
          }
        }
      }
    });
  }
};

export default AchievementModel;

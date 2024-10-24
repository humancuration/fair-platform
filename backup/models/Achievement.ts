import { PrismaClient, Achievement, UserAchievement } from '@prisma/client';

const prisma = new PrismaClient();

export type AchievementCreate = Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>;
export type AchievementUpdate = Partial<AchievementCreate>;

export const AchievementModel = {
  create: async (data: AchievementCreate): Promise<Achievement> => {
    return prisma.achievement.create({ data });
  },

  findById: async (id: string): Promise<Achievement | null> => {
    return prisma.achievement.findUnique({ where: { id } });
  },

  findAll: async (): Promise<Achievement[]> => {
    return prisma.achievement.findMany();
  },

  update: async (id: string, data: AchievementUpdate): Promise<Achievement> => {
    return prisma.achievement.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string): Promise<Achievement> => {
    return prisma.achievement.delete({ where: { id } });
  },

  getUserAchievements: async (achievementId: string): Promise<UserAchievement[]> => {
    return prisma.userAchievement.findMany({
      where: { achievementId },
      include: { user: true },
    });
  },
};

export default AchievementModel;

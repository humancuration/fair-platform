import { PrismaClient, Campaign as PrismaCampaign } from '@prisma/client';

const prisma = new PrismaClient();

export type CampaignCreate = Omit<PrismaCampaign, 'id' | 'createdAt' | 'updatedAt'>;
export type CampaignUpdate = Partial<CampaignCreate>;

export const CampaignModel = {
  create: async (data: CampaignCreate): Promise<PrismaCampaign> => {
    return prisma.campaign.create({ data });
  },

  findById: async (id: string): Promise<PrismaCampaign | null> => {
    return prisma.campaign.findUnique({
      where: { id },
      include: {
        createdBy: true,
        participants: true,
        rewards: true
      }
    });
  },

  findAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        skip,
        take: limit,
        include: {
          participants: true,
          rewards: true,
          createdBy: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }),
      prisma.campaign.count()
    ]);

    return { campaigns, total };
  },

  update: async (id: string, data: CampaignUpdate): Promise<PrismaCampaign> => {
    return prisma.campaign.update({
      where: { id },
      data,
      include: {
        participants: true,
        rewards: true
      }
    });
  },

  delete: async (id: string): Promise<PrismaCampaign> => {
    return prisma.campaign.delete({ where: { id } });
  }
};

export default CampaignModel;

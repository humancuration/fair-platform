import { PrismaClient } from '@prisma/client';
import type { Contribution as PrismaContribution } from '@prisma/client';

const prisma = new PrismaClient();

export type ContributionCreate = Omit<PrismaContribution, 'id' | 'createdAt'>;
export type ContributionUpdate = Partial<ContributionCreate>;

export const ContributionModel = {
  create: async (data: ContributionCreate): Promise<PrismaContribution> => {
    return prisma.contribution.create({
      data,
      include: {
        campaign: true,
        contributor: true
      }
    });
  },

  findById: async (id: number): Promise<PrismaContribution | null> => {
    return prisma.contribution.findUnique({
      where: { id },
      include: {
        campaign: true,
        contributor: true
      }
    });
  },

  findByCampaign: async (campaignId: string): Promise<PrismaContribution[]> => {
    return prisma.contribution.findMany({
      where: { campaignId },
      include: {
        contributor: true
      }
    });
  },

  findByContributor: async (contributorId: number): Promise<PrismaContribution[]> => {
    return prisma.contribution.findMany({
      where: { contributorId },
      include: {
        campaign: true
      }
    });
  },

  update: async (id: number, data: ContributionUpdate): Promise<PrismaContribution> => {
    return prisma.contribution.update({
      where: { id },
      data,
      include: {
        campaign: true,
        contributor: true
      }
    });
  },

  delete: async (id: number): Promise<PrismaContribution> => {
    return prisma.contribution.delete({
      where: { id }
    });
  },

  getTotalContributionsByCampaign: async (campaignId: string): Promise<number> => {
    const result = await prisma.contribution.aggregate({
      where: { campaignId },
      _sum: {
        amount: true
      }
    });
    return result._sum.amount || 0;
  },

  getContributorCount: async (campaignId: string): Promise<number> => {
    return prisma.contribution.count({
      where: { campaignId },
      distinct: ['contributorId']
    });
  }
};

export default ContributionModel;

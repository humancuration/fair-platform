// models/AffiliateProgram.ts

import { PrismaClient } from '@prisma/client';
import type { AffiliateProgram as PrismaAffiliateProgram } from '@prisma/client';

const prisma = new PrismaClient();

export type AffiliateProgramCreate = Omit<PrismaAffiliateProgram, 'id' | 'createdAt' | 'updatedAt'>;
export type AffiliateProgramUpdate = Partial<AffiliateProgramCreate>;

export const AffiliateProgramModel = {
  create: async (data: AffiliateProgramCreate): Promise<PrismaAffiliateProgram> => {
    return prisma.affiliateProgram.create({
      data,
      include: {
        brand: true,
        affiliateLinks: true
      }
    });
  },

  findById: async (id: number): Promise<PrismaAffiliateProgram | null> => {
    return prisma.affiliateProgram.findUnique({
      where: { id },
      include: {
        brand: true,
        affiliateLinks: true
      }
    });
  },

  findAll: async (): Promise<PrismaAffiliateProgram[]> => {
    return prisma.affiliateProgram.findMany({
      include: {
        brand: true,
        affiliateLinks: true
      }
    });
  },

  update: async (id: number, data: AffiliateProgramUpdate): Promise<PrismaAffiliateProgram> => {
    return prisma.affiliateProgram.update({
      where: { id },
      data,
      include: {
        brand: true,
        affiliateLinks: true
      }
    });
  },

  delete: async (id: number): Promise<PrismaAffiliateProgram> => {
    return prisma.affiliateProgram.delete({
      where: { id }
    });
  },

  // Additional methods for program management
  findByBrand: async (brandId: number): Promise<PrismaAffiliateProgram[]> => {
    return prisma.affiliateProgram.findMany({
      where: { brandId },
      include: {
        affiliateLinks: true
      }
    });
  },

  getStats: async (id: number) => {
    const stats = await prisma.affiliateProgram.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            affiliateLinks: true
          }
        },
        affiliateLinks: {
          select: {
            _count: {
              select: {
                clicks: true,
                conversions: true
              }
            }
          }
        }
      }
    });

    return stats;
  }
};

export default AffiliateProgramModel;

import { PrismaClient } from '@prisma/client';
import { LinkedContent, LinkedContentCreate, LinkedContentUpdate } from '../types/linked-content.types';

const prisma = new PrismaClient();

export const LinkedContentModel = {
  create: async (data: LinkedContentCreate): Promise<LinkedContent> => {
    return prisma.linkedContent.create({ data });
  },

  findById: async (id: number): Promise<LinkedContent | null> => {
    return prisma.linkedContent.findUnique({ where: { id } });
  },

  findAll: async (): Promise<LinkedContent[]> => {
    return prisma.linkedContent.findMany();
  },

  update: async (id: number, data: LinkedContentUpdate): Promise<LinkedContent> => {
    return prisma.linkedContent.update({
      where: { id },
      data,
    });
  },

  delete: async (id: number): Promise<LinkedContent> => {
    return prisma.linkedContent.delete({ where: { id } });
  },

  findByTypeAndRelatedId: async (type: LinkedContent['type'], relatedId: number): Promise<LinkedContent[]> => {
    return prisma.linkedContent.findMany({
      where: {
        type,
        relatedId,
      },
    });
  },
};

export default LinkedContentModel;

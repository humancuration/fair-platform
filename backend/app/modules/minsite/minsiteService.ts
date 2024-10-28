import { PrismaClient } from '@prisma/client';
import { MinsiteInput } from './types';
import { generateSlug } from '../../utils/slugGenerator';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

export class MinsiteService {
  async createMinsite(userId: string, input: MinsiteInput) {
    try {
      const minsite = await prisma.minsite.create({
        data: {
          ...input,
          userId,
          versions: [{ ...input, timestamp: new Date().toISOString() }],
        },
        include: {
          user: true,
          affiliateLinks: {
            include: {
              program: true,
            },
          },
        },
      });
      
      logger.info(`Minsite created: ${minsite.id}`);
      return minsite;
    } catch (error) {
      logger.error('Error creating minsite:', error);
      throw error;
    }
  }

  async publishMinsite(id: string, userId: string) {
    try {
      const minsite = await prisma.minsite.findFirst({
        where: { id, userId },
      });

      if (!minsite) {
        throw new Error('Minsite not found');
      }

      const slug = generateSlug(minsite.title);
      
      return await prisma.minsite.update({
        where: { id },
        data: {
          isPublished: true,
          publishedSlug: slug,
        },
        include: {
          user: true,
          affiliateLinks: {
            include: {
              program: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error publishing minsite:', error);
      throw error;
    }
  }

  async getMinsiteBySlug(slug: string) {
    return prisma.minsite.findUnique({
      where: { publishedSlug: slug },
      include: {
        user: true,
        affiliateLinks: {
          include: {
            program: true,
          },
        },
      },
    });
  }
}

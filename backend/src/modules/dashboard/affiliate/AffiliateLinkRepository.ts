import { PrismaClient, AffiliateLink, Prisma } from '@prisma/client';
import { createLogger } from '../../../utils/logger';

const prisma = new PrismaClient();
const logger = createLogger('AffiliateLinkRepository');

export interface FindAllOptions {
  page: number;
  limit: number;
  include?: Prisma.AffiliateLinkInclude;
}

export class AffiliateLinkRepository {
  /**
   * Create a new affiliate link
   */
  async create(
    data: Prisma.AffiliateLinkCreateInput
  ): Promise<AffiliateLink> {
    try {
      return await prisma.affiliateLink.create({
        data,
        include: {
          program: true,
          user: true,
        },
      });
    } catch (error) {
      logger.error('Error creating affiliate link:', error);
      throw error;
    }
  }

  /**
   * Find all affiliate links by creator with pagination
   */
  async findAllByCreator(
    userId: number,
    options: FindAllOptions
  ): Promise<{ rows: AffiliateLink[]; count: number }> {
    const { page, limit, include } = options;
    const skip = (page - 1) * limit;

    try {
      const [rows, count] = await Promise.all([
        prisma.affiliateLink.findMany({
          where: { userId },
          include,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.affiliateLink.count({
          where: { userId },
        }),
      ]);

      return { rows, count };
    } catch (error) {
      logger.error('Error finding affiliate links:', error);
      throw error;
    }
  }

  /**
   * Find affiliate link by tracking code
   */
  async findByTrackingCode(code: string): Promise<AffiliateLink | null> {
    try {
      return await prisma.affiliateLink.findUnique({
        where: { code },
        include: {
          program: true,
          user: true,
        },
      });
    } catch (error) {
      logger.error('Error finding affiliate link by code:', error);
      throw error;
    }
  }

  /**
   * Record a click for an affiliate link
   */
  async recordClick(
    linkId: number,
    data: Prisma.ClickTrackingCreateInput
  ): Promise<void> {
    try {
      await prisma.clickTracking.create({
        data: {
          ...data,
          affiliateLink: {
            connect: { id: linkId },
          },
        },
      });
    } catch (error) {
      logger.error('Error recording click:', error);
      throw error;
    }
  }

  /**
   * Delete an affiliate link
   */
  async delete(id: number): Promise<void> {
    try {
      await prisma.affiliateLink.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Error deleting affiliate link:', error);
      throw error;
    }
  }

  /**
   * Update an affiliate link
   */
  async update(
    id: number,
    data: Prisma.AffiliateLinkUpdateInput
  ): Promise<AffiliateLink> {
    try {
      return await prisma.affiliateLink.update({
        where: { id },
        data,
        include: {
          program: true,
          user: true,
        },
      });
    } catch (error) {
      logger.error('Error updating affiliate link:', error);
      throw error;
    }
  }

  /**
   * Get affiliate link statistics
   */
  async getLinkStats(linkId: number): Promise<{
    totalClicks: number;
    totalEarnings: number;
    clicksByDate: Record<string, number>;
  }> {
    try {
      const link = await prisma.affiliateLink.findUnique({
        where: { id: linkId },
        include: {
          clicks: {
            select: {
              clickedAt: true,
            },
          },
          payouts: {
            where: {
              status: 'completed',
            },
            select: {
              amount: true,
            },
          },
        },
      });

      if (!link) {
        throw new Error('Affiliate link not found');
      }

      const totalClicks = link.clicks.length;
      const totalEarnings = link.payouts.reduce(
        (sum, payout) => sum + payout.amount,
        0
      );

      const clicksByDate = link.clicks.reduce((acc, click) => {
        const date = click.clickedAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalClicks,
        totalEarnings,
        clicksByDate,
      };
    } catch (error) {
      logger.error('Error getting link stats:', error);
      throw error;
    }
  }

  /**
   * Bulk update affiliate links
   */
  async bulkUpdate(
    ids: number[],
    data: Prisma.AffiliateLinkUpdateInput
  ): Promise<number> {
    try {
      const updatePromises = ids.map(id =>
        prisma.affiliateLink.update({
          where: { id },
          data,
        })
      );

      const results = await Promise.all(updatePromises);
      return results.length;
    } catch (error) {
      logger.error('Error performing bulk update:', error);
      throw error;
    }
  }
}

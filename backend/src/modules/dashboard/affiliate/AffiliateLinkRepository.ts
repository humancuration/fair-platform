import { AffiliateLink } from '../models/AffiliateLink';
import { AffiliateProgram } from '../models/AffiliateProgram';
import { Transaction } from 'sequelize';

export class AffiliateLinkRepository {
  async create(data: Partial<AffiliateLink>, options?: { transaction?: Transaction }): Promise<AffiliateLink> {
    return AffiliateLink.create(data, options);
  }

  async findAllByCreator(creatorId: number, options: { page: number; limit: number; include?: any[] }): Promise<{ rows: AffiliateLink[]; count: number }> {
    const { page, limit, include } = options;
    const offset = (page - 1) * limit;

    return AffiliateLink.findAndCountAll({
      where: { creatorId },
      limit,
      offset,
      include,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByTrackingCode(trackingCode: string): Promise<AffiliateLink | null> {
    return AffiliateLink.findOne({
      where: { trackingCode },
      include: [{ model: AffiliateProgram }],
    });
  }

  async incrementClicks(id: number): Promise<[number, AffiliateLink[]]> {
    return AffiliateLink.increment('clicks', { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return AffiliateLink.destroy({ where: { id } });
  }

  async update(id: number, data: Partial<AffiliateLink>): Promise<[number, AffiliateLink[]]> {
    return AffiliateLink.update(data, { where: { id } });
  }
}
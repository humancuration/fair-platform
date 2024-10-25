import { prisma } from '../../lib/prisma';
import type { Group, GroupMember, Prisma } from '@prisma/client';
import { Redis } from 'ioredis';
import { logger } from '~/utils/logger';

const redis = new Redis(process.env.REDIS_URL);
const CACHE_TTL = 3600; // 1 hour

export class GroupRepository {
  async create(data: Prisma.GroupCreateInput): Promise<Group> {
    const group = await prisma.group.create({ 
      data,
      include: {
        members: true,
        settings: true,
        integrations: true,
      }
    });
    
    await this.cacheGroup(group);
    return group;
  }

  async findById(id: string) {
    // Try cache first
    const cached = await redis.get(`group:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true
          }
        },
        settings: true,
        integrations: true,
        groupType: true,
      },
    });

    if (group) {
      await this.cacheGroup(group);
    }

    return group;
  }

  async update(id: string, data: Prisma.GroupUpdateInput) {
    const group = await prisma.group.update({
      where: { id },
      data,
      include: {
        members: true,
        settings: true,
        integrations: true,
      }
    });

    await this.cacheGroup(group);
    return group;
  }

  private async cacheGroup(group: Group) {
    try {
      await redis.setex(`group:${group.id}`, CACHE_TTL, JSON.stringify(group));
    } catch (error) {
      logger.error('Cache error:', error);
    }
  }

  async setMemberRole(groupId: string, userId: string, role: string) {
    const result = await prisma.groupMember.upsert({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      update: { role },
      create: {
        groupId,
        userId,
        role,
      },
      include: {
        user: true
      }
    });

    await redis.del(`group:${groupId}`);
    return result;
  }

  async canUserManageSettings(groupId: string, userId: string) {
    const member = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        role: { in: ['ADMIN', 'MODERATOR'] },
      },
    });
    return !!member;
  }
}

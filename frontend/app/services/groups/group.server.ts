import type { Group, GroupMember, Prisma } from '@prisma/client';
import { prisma } from '~/db.server';
import { Redis } from 'ioredis';
import { logger } from '~/utils/logger.client';

const redis = new Redis(process.env.REDIS_URL!);
const CACHE_TTL = 3600; // 1 hour

interface GroupServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

interface GroupSettings {
  isPrivate: boolean;
  allowInvites: boolean;
  requireApproval: boolean;
  notificationsEnabled: boolean;
  [key: string]: unknown;
}

export class GroupService {
  async create(data: Prisma.GroupCreateInput): Promise<GroupServiceResponse<Group>> {
    try {
      const group = await prisma.group.create({ 
        data,
        include: {
          members: true,
          settings: true,
          integrations: true,
        }
      });
      
      await this.cacheGroup(group);

      // Index for search
      await this.indexGroupForSearch(group);

      return { success: true, data: group };
    } catch (error) {
      logger.error('Failed to create group:', error);
      return { 
        success: false, 
        error: 'Failed to create group',
        code: 'GROUP_CREATE_ERROR'
      };
    }
  }

  async findById(id: string): Promise<Group | null> {
    // Try cache first
    const cached = await redis.get(`group:${id}`);
    if (cached) {
      return JSON.parse(cached) as Group;
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              }
            }
          }
        },
        settings: true,
        integrations: true,
      },
    });

    if (group) {
      await this.cacheGroup(group);
    }

    return group;
  }

  async update(id: string, data: Prisma.GroupUpdateInput): Promise<GroupServiceResponse<Group>> {
    try {
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
      await this.indexGroupForSearch(group);

      return { success: true, data: group };
    } catch (error) {
      logger.error('Failed to update group:', error);
      return { 
        success: false, 
        error: 'Failed to update group',
        code: 'GROUP_UPDATE_ERROR'
      };
    }
  }

  async updateSettings(
    groupId: string, 
    userId: string, 
    settings: Partial<GroupSettings>
  ): Promise<GroupServiceResponse<Group>> {
    try {
      const hasPermission = await this.canUserManageSettings(groupId, userId);
      if (!hasPermission) {
        return { 
          success: false, 
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        };
      }

      const group = await this.update(groupId, {
        settings: {
          update: settings
        }
      });

      return group;
    } catch (error) {
      logger.error('Failed to update group settings:', error);
      return { 
        success: false, 
        error: 'Failed to update settings',
        code: 'SETTINGS_UPDATE_ERROR'
      };
    }
  }

  async setMemberRole(groupId: string, userId: string, role: string): Promise<GroupMember> {
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
        user: {
          select: {
            username: true,
            avatar: true,
          }
        }
      }
    });

    await redis.del(`group:${groupId}`);
    return result;
  }

  async canUserManageSettings(groupId: string, userId: string): Promise<boolean> {
    const member = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        role: { in: ['ADMIN', 'MODERATOR'] },
      },
    });
    return !!member;
  }

  async findAll(): Promise<Group[]> {
    // Try cache first
    const cached = await redis.get('groups:all');
    if (cached) {
      return JSON.parse(cached) as Group[];
    }

    const groups = await prisma.group.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true,
              }
            }
          }
        },
        settings: true,
        integrations: true,
      },
    });

    await redis.setex('groups:all', CACHE_TTL, JSON.stringify(groups));
    return groups;
  }

  private async cacheGroup(group: Group): Promise<void> {
    try {
      await redis.setex(`group:${group.id}`, CACHE_TTL, JSON.stringify(group));
    } catch (error) {
      logger.error('Cache error:', error);
    }
  }

  private async indexGroupForSearch(group: Group): Promise<void> {
    try {
      await prisma.searchIndex.upsert({
        where: { entityId: group.id },
        update: {
          content: `${group.name} ${group.description}`,
          type: 'GROUP',
          metadata: {
            memberCount: group.members?.length || 0,
            isPrivate: group.settings?.isPrivate || false,
          },
        },
        create: {
          entityId: group.id,
          type: 'GROUP',
          content: `${group.name} ${group.description}`,
          metadata: {
            memberCount: group.members?.length || 0,
            isPrivate: group.settings?.isPrivate || false,
          },
        },
      });
    } catch (error) {
      logger.error('Search indexing error:', error);
    }
  }
}

export const groupService = new GroupService();

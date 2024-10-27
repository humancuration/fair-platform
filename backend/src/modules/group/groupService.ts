import type { Group } from '@prisma/client';
import { GroupRepository } from './groupRepository';
import { GroupCreateInput } from '../../../../backup/models/groupModel';
import { logger } from '~/utils/logger.client';
import { GroupServiceResponse, GroupSettings } from './types';
import { PubSub } from 'graphql-subscriptions';
import { OpenSearchClient } from '~/lib/opensearch';

const pubsub = new PubSub();
const searchClient = new OpenSearchClient();

export class GroupService {
  constructor(private groupRepository: GroupRepository) {}

  async createGroup(data: GroupCreateInput, creatorId: string): Promise<GroupServiceResponse<Group>> {
    try {
      const group = await this.groupRepository.create({
        ...data,
        creatorId,
        members: {
          create: {
            userId: creatorId,
            role: 'ADMIN',
          },
        },
      });

      // Index in OpenSearch
      await searchClient.index({
        index: 'groups',
        id: group.id,
        body: {
          name: group.name,
          description: group.description,
          createdAt: group.createdAt,
        },
      });

      // Publish group creation event
      await pubsub.publish('GROUP_CREATED', { groupCreated: group });

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

  async updateGroupSettings(
    groupId: string, 
    userId: string, 
    data: Partial<GroupSettings>
  ): Promise<GroupServiceResponse<Group>> {
    try {
      const hasPermission = await this.groupRepository.canUserManageSettings(groupId, userId);
      if (!hasPermission) {
        return { 
          success: false, 
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        };
      }

      const group = await this.groupRepository.update(groupId, {
        settings: {
          update: data
        }
      });

      await pubsub.publish('GROUP_UPDATED', { groupUpdated: group });

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

  // GraphQL Resolvers
  resolvers = {
    Query: {
      group: async (_, { id }) => {
        return this.groupRepository.findById(id);
      },
      groupMembers: async (_, { groupId }) => {
        const group = await this.groupRepository.findById(groupId);
        return group?.members || [];
      }
    },
    Mutation: {
      createGroup: async (_, { input }, { user }) => {
        return this.createGroup(input, user.id);
      },
      updateGroupSettings: async (_, { groupId, settings }, { user }) => {
        return this.updateGroupSettings(groupId, user.id, settings);
      }
    },
    Subscription: {
      groupCreated: {
        subscribe: () => pubsub.asyncIterator(['GROUP_CREATED'])
      },
      groupUpdated: {
        subscribe: () => pubsub.asyncIterator(['GROUP_UPDATED'])
      }
    }
  };
}

import type { Group } from '@prisma/client';
import { GroupRepository } from './group/GroupRepository';
import type { GroupCreateInput, GroupServiceResponse, GroupSettings } from '~/types/group';
import { PubSub } from 'graphql-subscriptions';
import { OpenSearchClient } from '~/utils/opensearch.server';
import { logger } from '~/utils/logger';

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

  async addMember(groupId: string, requesterId: string, userIdToAdd: string, role?: string): Promise<GroupServiceResponse<GroupMember>> {
    try {
      // Check if requester has permissions (handled in repository)
      
      const member = await this.groupRepository.addMember(groupId, userIdToAdd, role || 'MEMBER');

      // Publish event if needed
      await pubsub.publish('MEMBER_ADDED', { memberAdded: member });

      return { success: true, data: member };
    } catch (error) {
      logger.error('Failed to add member:', error);
      return { 
        success: false, 
        error: 'Failed to add member',
        code: 'ADD_MEMBER_ERROR'
      };
    }
  }

  async removeMember(groupId: string, requesterId: string, userIdToRemove: string): Promise<GroupServiceResponse<void>> {
    try {
      // Check if requester has permissions
      
      const result = await this.groupRepository.removeMember(groupId, userIdToRemove);

      // Publish event if needed
      await pubsub.publish('MEMBER_REMOVED', { memberRemoved: userIdToRemove });

      return { success: true };
    } catch (error) {
      logger.error('Failed to remove member:', error);
      return { 
        success: false, 
        error: 'Failed to remove member',
        code: 'REMOVE_MEMBER_ERROR'
      };
    }
  }

  async updateMemberRole(groupId: string, requesterId: string, userIdToUpdate: string, newRole: GroupRole): Promise<GroupServiceResponse<GroupMember>> {
    try {
      // Check if requester has permissions

      const updatedMember = await this.groupRepository.setMemberRole(groupId, userIdToUpdate, newRole);

      // Publish event if needed
      await pubsub.publish('MEMBER_UPDATED', { memberUpdated: updatedMember });

      return { success: true, data: updatedMember };
    } catch (error) {
      logger.error('Failed to update member role:', error);
      return { 
        success: false, 
        error: 'Failed to update member role',
        code: 'UPDATE_ROLE_ERROR'
      };
    }
  }

  // GraphQL Resolvers (if using GraphQL)
  resolvers = {
    Query: {
      group: async (_: any, { id }: { id: string }) => {
        return this.groupRepository.findById(id);
      },
      groupMembers: async (_: any, { groupId }: { groupId: string }) => {
        const group = await this.groupRepository.findById(groupId);
        return group?.members || [];
      }
    },
    Mutation: {
      createGroup: async (_: any, { input }: { input: GroupCreateInput }, { user }: { user: any }) => {
        return this.createGroup(input, user.id);
      },
      updateGroupSettings: async (_: any, { groupId, settings }: { groupId: string, settings: Partial<GroupSettings> }, { user }: { user: any }) => {
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

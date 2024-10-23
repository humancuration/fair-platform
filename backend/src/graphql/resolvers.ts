import { PubSub } from 'graphql-subscriptions';
import { UserService } from '../modules/user/userService';
import { GroupService } from '../modules/group/groupService';
import { GraphQLError } from 'graphql';
import versionControlResolvers from '../modules/versionControl/versionControlResolvers';
import { IContext } from '../types/context';
import { UserInput, GroupInput } from '../types/inputs';
import  logger from '../utils/logger';
import { IResolvers } from '@graphql-tools/utils';
import { User } from '../modules/user/User';
import { Group } from '../modules/group/Group';
import { Event } from '../models/Event';
import { Petition } from '../models/petition.model';
import { Vote } from '../models/vote.model';
import { Resource } from '../models/resource.model';
import { Project } from '../models/project.model';
import { Grant } from '../models/Grant';
import { Achievement } from '../models/Achievement';
import { UserAchievement } from '../models/UserAchievement';
import { Item } from '../models/Item';
import { Inventory } from '../models/Inventory';
import { Testimonial } from '../models/Testimonial';
import { AffiliateLink } from '../models/AffiliateLink';
import { AffiliateProgram } from '../models/AffiliateProgram';
import { GroupMember } from '../models/GroupMember';

const pubsub = new PubSub();
const userService = new UserService();
const groupService = new GroupService();

const resolvers: IResolvers = {
  Query: {
    user: async (_: unknown, { id }: { id: string }, context: IContext) => {
      try {
        // Check authentication
        if (!context.currentUser) {
          throw new GraphQLError('Not authenticated', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        const user = await userService.getUserById(id);
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'USER_NOT_FOUND' },
          });
        }
        return user;
      } catch (error) {
        logger.error('Error fetching user:', error);
        throw new GraphQLError('Failed to fetch user', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    group: async (_: unknown, { id }: { id: string }, context: IContext) => {
      try {
        // Check authentication
        if (!context.currentUser) {
          throw new GraphQLError('Not authenticated', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        const group = await groupService.getGroupById(id);
        if (!group) {
          throw new GraphQLError('Group not found', {
            extensions: { code: 'GROUP_NOT_FOUND' },
          });
        }
        return group;
      } catch (error) {
        logger.error('Error fetching group:', error);
        throw new GraphQLError('Failed to fetch group', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    allGroups: async (_: unknown, __: unknown, context: IContext) => {
      try {
        // Check authentication
        if (!context.currentUser) {
          throw new GraphQLError('Not authenticated', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        return await groupService.getAllGroups();
      } catch (error) {
        logger.error('Error fetching groups:', error);
        throw new GraphQLError('Failed to fetch groups', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    ...versionControlResolvers.Query,
    // User queries
    users: async () => User.findAll(),

    // Group queries
    groups: async () => Group.findAll(),
    groupMembers: async (_, { groupId }) => {
      return GroupMember.findAll({
        where: { groupId },
        include: [User],
      });
    },

    // Event queries
    events: async (_, { groupId }) => {
      return Event.findAll({
        where: groupId ? { groupId } : undefined,
        include: [Group, 'attendees'],
      });
    },

    // Petition queries
    petitions: async (_, { groupId, status }) => {
      return Petition.findAll({
        where: {
          ...(groupId && { groupId }),
          ...(status && { status }),
        },
        include: [Group, 'votes'],
      });
    },

    // Resource queries
    resources: async (_, { groupId, type }) => {
      return Resource.findAll({
        where: {
          ...(groupId && { groupId }),
          ...(type && { type }),
        },
        include: [Group, User],
      });
    },

    // Project queries
    projects: async (_, { groupId, status }) => {
      return Project.findAll({
        where: {
          ...(groupId && { groupId }),
          ...(status && { status }),
        },
        include: [Group, 'creator'],
      });
    },

    // Grant queries
    grants: async (_, { status }) => {
      return Grant.findAll({
        where: status ? { status } : undefined,
        include: ['applicant', Group],
      });
    },

    // Achievement queries
    achievements: async () => Achievement.findAll(),
    userAchievements: async (_, { userId }) => {
      return UserAchievement.findAll({
        where: { userId },
        include: [Achievement],
      });
    },

    // Item and Inventory queries
    items: async (_, { type }) => {
      return Item.findAll({
        where: type ? { type } : undefined,
      });
    },
    inventory: async (_, { userId }) => {
      return Inventory.findAll({
        where: { userId },
        include: [Item],
      });
    },

    // Testimonial queries
    testimonials: async (_, { status }) => {
      return Testimonial.findAll({
        where: status ? { status } : undefined,
        include: [User],
      });
    },

    // Affiliate queries
    affiliatePrograms: async () => AffiliateProgram.findAll(),
    affiliateLinks: async (_, { userId }) => {
      return AffiliateLink.findAll({
        where: { userId },
        include: [AffiliateProgram],
      });
    },
  },

  Mutation: {
    createUser: async (_: unknown, { input }: { input: UserInput }, context: IContext) => {
      try {
        // Check authentication and authorization
        if (!context.currentUser || !context.currentUser.isAdmin) {
          throw new GraphQLError('Not authorized to create users', {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        const user = await userService.createUser(input);
        return user;
      } catch (error) {
        logger.error('Error creating user:', error);
        throw new GraphQLError('Failed to create user', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    createGroup: async (_: unknown, { input }: { input: GroupInput }, context: IContext) => {
      try {
        // Check authentication
        if (!context.currentUser) {
          throw new GraphQLError('Not authenticated', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        const newGroup = await groupService.createGroup(input);
        pubsub.publish('GROUP_CREATED', { groupCreated: newGroup });
        return newGroup;
      } catch (error) {
        logger.error('Error creating group:', error);
        throw new GraphQLError('Failed to create group', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    joinGroup: async (_: unknown, { groupId }: { groupId: string }, context: IContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('You must be logged in to join a group', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      try {
        const updatedGroup = await groupService.addMemberToGroup(groupId, context.currentUser.id);
        pubsub.publish('NEW_GROUP_MEMBER', { newGroupMember: context.currentUser, groupId });
        return updatedGroup;
      } catch (error) {
        logger.error('Error joining group:', error);
        throw new GraphQLError('Failed to join group', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    ...versionControlResolvers.Mutation,
  },
  Subscription: {
    groupCreated: {
      subscribe: () => pubsub.asyncIterator(['GROUP_CREATED']),
    },
    newGroupMember: {
      subscribe: () => pubsub.asyncIterator(['NEW_GROUP_MEMBER']),
    },
  },
};

export default resolvers;

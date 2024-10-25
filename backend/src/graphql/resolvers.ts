import { PubSub } from 'graphql-subscriptions';
import { UserService } from '../modules/user/userService';
import { GroupService } from '../modules/group/groupService';
import { GraphQLError } from 'graphql';
import { IContext } from '../types/context';
import { UserInput, GroupInput } from '../types/inputs';
import logger from '../utils/logger';
import { IResolvers } from '@graphql-tools/utils';
import { prisma } from '../config/database';
import { uploadToMinIO } from '../utils/minio';
import { SurveyAnalyticsService } from '../modules/survey/surveyAnalyticsService';

const pubsub = new PubSub();
const userService = new UserService();
const groupService = new GroupService();
const surveyAnalyticsService = new SurveyAnalyticsService();

const resolvers: IResolvers = {
  Query: {
    user: async (_: unknown, { id }: { id: string }, context: IContext) => {
      try {
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

    // User queries
    users: async () => {
      return prisma.user.findMany();
    },

    // Group queries
    groups: async () => {
      return prisma.group.findMany();
    },

    groupMembers: async (_: unknown, { groupId }: { groupId: number }) => {
      return prisma.groupMember.findMany({
        where: { groupId },
        include: { user: true }
      });
    },

    // Event queries
    events: async (_: unknown, { groupId }: { groupId?: number }) => {
      return prisma.event.findMany({
        where: groupId ? { groupId } : undefined,
        include: {
          group: true,
          attendees: true
        }
      });
    },

    // Petition queries
    petitions: async (_: unknown, { groupId, status }: { groupId?: number; status?: string }) => {
      return prisma.petition.findMany({
        where: {
          ...(groupId && { groupId }),
          ...(status && { status })
        },
        include: {
          group: true,
          votes: true
        }
      });
    },

    // Resource queries
    resources: async (_: unknown, { groupId, type }: { groupId?: number; type?: string }) => {
      return prisma.resource.findMany({
        where: {
          ...(groupId && { groupId }),
          ...(type && { type })
        },
        include: {
          group: true,
          user: true
        }
      });
    },

    // Project queries
    projects: async (_: unknown, { groupId, status }: { groupId?: number; status?: string }) => {
      return prisma.project.findMany({
        where: {
          ...(groupId && { groupId }),
          ...(status && { status })
        },
        include: {
          group: true,
          creator: true
        }
      });
    },

    // Grant queries
    grants: async (_: unknown, { status }: { status?: string }) => {
      return prisma.grant.findMany({
        where: status ? { status } : undefined,
        include: {
          applicant: true,
          group: true
        }
      });
    },

    // Achievement queries
    achievements: async () => {
      return prisma.achievement.findMany();
    },

    userAchievements: async (_: unknown, { userId }: { userId: number }) => {
      return prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true }
      });
    },

    // Survey queries
    surveyResults: async (_: unknown, { surveyId }: { surveyId: string }) => {
      return prisma.surveyResponse.findMany({
        where: { surveyId }
      });
    },

    combinedAnalysis: async (_: unknown, { surveyIds }: { surveyIds: string[] }) => {
      return surveyAnalyticsService.combineSurveyResults(surveyIds);
    },

    crossSurveyCorrelations: async (_: unknown, { surveyIds, questionIds }: { surveyIds: string[], questionIds: string[] }) => {
      return surveyAnalyticsService.computeCorrelations(surveyIds, questionIds);
    },

    groupEmojis: async (_: unknown, { groupId }: { groupId: number }, context: IContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const group = await prisma.group.findUnique({
        where: { id: groupId }
      });
      
      if (!group) throw new Error('Group not found');
      
      return prisma.emoji.findMany({
        where: {
          groupId,
          OR: [
            { isPublic: true },
            { createdById: context.currentUser.id }
          ]
        }
      });
    },
    
    publicEmojis: async () => {
      return prisma.emoji.findMany({
        where: { 
          isPublic: true,
          groupId: null
        }
      });
    },
    
    purchasedEmojis: async (_: unknown, __: unknown, context: IContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const userEmojis = await prisma.userEmoji.findMany({
        where: { userId: context.currentUser.id },
        include: { emoji: true }
      });
      
      return userEmojis.map((ue: UserEmoji & { emoji: Emoji }) => ue.emoji);
    }
  },

  Mutation: {
    createUser: async (_: unknown, { input }: { input: UserInput }, context: IContext) => {
      try {
        if (!context.currentUser?.isAdmin) {
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

    uploadEmoji: async (_: unknown, 
      { groupId, file, name, price, isPublic }: { groupId?: number; file: any; name: string; price?: number; isPublic?: boolean }, 
      context: IContext
    ) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (groupId) {
        const group = await prisma.group.findUnique({
          where: { id: groupId }
        });
        if (!group) throw new Error('Group not found');
      }
      
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      
      const url = await uploadToMinIO(stream, `emojis/${Date.now()}-${filename}`);
      
      return prisma.emoji.create({
        data: {
          name,
          url,
          createdById: context.currentUser.id,
          groupId,
          price,
          isPublic
        }
      });
    },
    
    updateEmoji: async (_: unknown, 
      { emojiId, ...updates }: { emojiId: number; [key: string]: any }, 
      context: IContext
    ) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const emoji = await prisma.emoji.findUnique({
        where: { id: emojiId }
      });

      if (!emoji) throw new Error('Emoji not found');
      if (emoji.createdById !== context.currentUser.id) throw new Error('Unauthorized');
      
      return prisma.emoji.update({
        where: { id: emojiId },
        data: updates
      });
    },
    
    deleteEmoji: async (_: unknown, { emojiId }: { emojiId: number }, context: IContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const emoji = await prisma.emoji.findUnique({
        where: { id: emojiId }
      });

      if (!emoji) throw new Error('Emoji not found');
      if (emoji.createdById !== context.currentUser.id) throw new Error('Unauthorized');
      
      await prisma.emoji.delete({
        where: { id: emojiId }
      });

      return true;
    },
    
    purchaseEmoji: async (_: unknown, { emojiId }: { emojiId: number }, context: IContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const emoji = await prisma.emoji.findUnique({
        where: { id: emojiId }
      });

      if (!emoji) throw new Error('Emoji not found');
      
      // Handle payment through Stripe
      // ... payment processing code ...
      
      await prisma.userEmoji.create({
        data: {
          userId: context.currentUser.id,
          emojiId: emoji.id
        }
      });
      
      return true;
    }
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

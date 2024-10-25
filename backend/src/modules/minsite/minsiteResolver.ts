import { ApolloError } from '@apollo/server/errors';
import { logger } from '../../utils/logger';
import { MinsiteService } from './minsiteService';
import { Context } from '../../types/context';

const minsiteService = new MinsiteService();

export const minsiteResolvers = {
  Query: {
    minsite: async (_: any, { id }: { id: string }, ctx: Context) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await minsiteService.getMinsite(id, ctx.user.id);
      } catch (error) {
        logger.error('Error in minsite query:', error);
        throw error;
      }
    },
  },

  Mutation: {
    createMinsite: async (_: any, { input }: { input: any }, ctx: Context) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await minsiteService.createMinsite(ctx.user.id, input);
      } catch (error) {
        logger.error('Error in createMinsite mutation:', error);
        throw error;
      }
    },

    publishMinsite: async (_: any, { id }: { id: string }, ctx: Context) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await minsiteService.publishMinsite(id, ctx.user.id);
      } catch (error) {
        logger.error('Error in publishMinsite mutation:', error);
        throw error;
      }
    },
  },
};

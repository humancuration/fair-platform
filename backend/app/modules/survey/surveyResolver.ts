import { ApolloError } from '@apollo/server/errors';
import { PubSub } from 'graphql-subscriptions';
import { logger } from '../../utils/logger';
import { SurveyService } from './surveyService';
import { Context } from '../../types/context';
import {
  Survey,
  SurveyResponse,
  Analytics,
  CreateSurveyInput,
  SurveyResponseInput,
  SurveyDomain,
} from './types';

const surveyService = new SurveyService();
const pubsub = new PubSub();

export const surveyResolvers = {
  Query: {
    survey: async (_: any, { id }: { id: string }, ctx: Context) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await surveyService.getSurvey(id);
      } catch (error) {
        logger.error('Error in survey query:', error);
        throw error;
      }
    },

    surveys: async (_: any, { domain }: { domain?: SurveyDomain }, ctx: Context) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await surveyService.getSurveys(domain);
      } catch (error) {
        logger.error('Error in surveys query:', error);
        throw error;
      }
    },
  },

  Mutation: {
    createSurvey: async (_: any, { input }: { input: CreateSurveyInput }, ctx: Context) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await surveyService.createSurvey(ctx.user.id, input);
      } catch (error) {
        logger.error('Error in createSurvey mutation:', error);
        throw error;
      }
    },

    submitSurveyResponse: async (
      _: any,
      { surveyId, input }: { surveyId: string; input: SurveyResponseInput },
      ctx: Context
    ) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        const response = await surveyService.submitResponse(surveyId, ctx.user.id, input);
        await pubsub.publish(`SURVEY_RESPONSE_ADDED:${surveyId}`, { surveyResponseAdded: response });
        return response;
      } catch (error) {
        logger.error('Error in submitSurveyResponse mutation:', error);
        throw error;
      }
    },
  },

  Subscription: {
    surveyResponseAdded: {
      subscribe: (_: any, { surveyId }: { surveyId: string }) => 
        pubsub.asyncIterator([`SURVEY_RESPONSE_ADDED:${surveyId}`]),
    },

    analyticsUpdated: {
      subscribe: (_: any, { surveyId }: { surveyId: string }) =>
        pubsub.asyncIterator([`ANALYTICS_UPDATED:${surveyId}`]),
    },
  },
};

import { PrismaClient } from '@prisma/client';
import { CreateSurveyInput, SurveyResponseInput } from './types';
import { AdvancedAnalytics } from './analytics/advancedAnalytics';
import { DomainAnalytics } from './analytics/domainAnalytics';
import { logger } from '../../utils/logger';
import { pubsub } from '../../utils/pubsub';

const prisma = new PrismaClient();
const analytics = new AdvancedAnalytics();
const domainAnalytics = new DomainAnalytics();

export class SurveyService {
  async createSurvey(userId: number, input: CreateSurveyInput) {
    try {
      const survey = await prisma.survey.create({
        data: {
          ...input,
          createdById: userId,
          status: 'DRAFT',
          collaborators: {
            connect: [{ id: userId }]
          }
        },
        include: {
          createdBy: true,
          collaborators: true,
        },
      });

      logger.info(`Survey created: ${survey.id}`);
      return survey;
    } catch (error) {
      logger.error('Error creating survey:', error);
      throw error;
    }
  }

  async submitResponse(surveyId: string, userId: number, input: SurveyResponseInput) {
    try {
      const response = await prisma.surveyResponse.create({
        data: {
          surveyId,
          respondentId: userId,
          ...input,
        },
        include: {
          respondent: true,
        },
      });

      // Trigger real-time updates
      await pubsub.publish(`SURVEY_RESPONSE_ADDED:${surveyId}`, { 
        surveyResponseAdded: response 
      });

      // Update analytics
      await this.updateAnalytics(surveyId);

      return response;
    } catch (error) {
      logger.error('Error submitting survey response:', error);
      throw error;
    }
  }

  async generateAnalytics(surveyId: string) {
    try {
      const [survey, responses] = await Promise.all([
        prisma.survey.findUnique({ where: { id: surveyId } }),
        prisma.surveyResponse.findMany({ where: { surveyId } }),
      ]);

      if (!survey) {
        throw new Error('Survey not found');
      }

      // Generate basic analytics
      const basicAnalytics = await analytics.analyzePatterns(
        responses.map(r => r.answers),
        { method: 'all' }
      );

      // Generate domain-specific analytics
      let domainInsights = {};
      if (survey.domain === 'GAME_TESTING') {
        domainInsights = await domainAnalytics.analyzeGameTestData(responses);
      } else if (survey.domain === 'MEDIA_SCREENING') {
        domainInsights = await domainAnalytics.analyzeScreeningData(responses);
      } else if (survey.domain === 'ECO_PRODUCTION') {
        domainInsights = await domainAnalytics.analyzeProductionData(responses);
      }

      const results = {
        ...basicAnalytics,
        domainInsights,
        timestamp: new Date(),
      };

      // Save analytics results
      const analytics = await prisma.analytics.upsert({
        where: { surveyId },
        create: {
          surveyId,
          results,
        },
        update: {
          results,
        },
      });

      // Notify subscribers
      await pubsub.publish(`ANALYTICS_UPDATED:${surveyId}`, {
        analyticsUpdated: analytics,
      });

      return analytics;
    } catch (error) {
      logger.error('Error generating analytics:', error);
      throw error;
    }
  }

  private async updateAnalytics(surveyId: string) {
    try {
      await this.generateAnalytics(surveyId);
    } catch (error) {
      logger.error('Error updating analytics:', error);
    }
  }

  // Additional methods...
}

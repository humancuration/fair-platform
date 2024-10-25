import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';
import { RetentionPolicy } from './types';
import { logger } from '../../utils/logger';
import { trace } from '@opentelemetry/api';
import { createHash } from 'crypto';

export class DataRetentionService {
  private prisma: PrismaClient;
  private opensearchClient: Client;

  constructor(prisma: PrismaClient, opensearchClient: Client) {
    this.prisma = prisma;
    this.opensearchClient = opensearchClient;
  }

  startRetentionTask() {
    cron.schedule('0 0 * * *', async () => {
      const span = trace.getTracer('retention-service').startSpan('dailyRetentionTask');

      try {
        logger.info('Starting daily data retention task');

        const users = await this.prisma.user.findMany({
          select: {
            id: true,
            retentionPolicy: true
          }
        });

        for (const user of users) {
          const policy = user.retentionPolicy as RetentionPolicy;
          
          if (policy.anonymize) {
            await this.anonymizeUserData(user.id.toString());
          } else {
            await this.applyRetentionPolicy(user.id.toString(), policy);
          }
        }

        logger.info('Data retention task completed successfully');
      } catch (error) {
        logger.error(`Error in data retention task: ${error}`);
        span.recordException(error as Error);
      } finally {
        span.end();
      }
    });
  }

  private async anonymizeUserData(userId: string): Promise<void> {
    const anonymizedId = createHash('sha256')
      .update(userId + process.env.ANONYMIZATION_SALT)
      .digest('hex');

    await Promise.all([
      // Update PostgreSQL
      this.prisma.analyticsEvent.updateMany({
        where: { userId },
        data: { userId: anonymizedId }
      }),

      // Update OpenSearch
      this.opensearchClient.updateByQuery({
        index: 'analytics-events',
        body: {
          query: { match: { userId } },
          script: {
            source: `ctx._source.userId = '${anonymizedId}'`
          }
        }
      })
    ]);
  }

  private async applyRetentionPolicy(userId: string, policy: RetentionPolicy): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionPeriod);

    await Promise.all([
      // Delete from PostgreSQL
      this.prisma.analyticsEvent.deleteMany({
        where: {
          userId,
          timestamp: { lt: cutoffDate },
          eventType: { in: policy.dataCategories }
        }
      }),

      // Delete from OpenSearch
      this.opensearchClient.deleteByQuery({
        index: 'analytics-events',
        body: {
          query: {
            bool: {
              must: [
                { match: { userId } },
                { range: { timestamp: { lt: cutoffDate.toISOString() } } },
                { terms: { eventType: policy.dataCategories } }
              ]
            }
          }
        }
      })
    ]);
  }
}

export default new DataRetentionService(
  new PrismaClient(),
  new Client({ node: process.env.OPENSEARCH_URL })
);

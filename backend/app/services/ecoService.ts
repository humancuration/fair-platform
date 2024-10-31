import { prisma } from '../lib/prisma';
import { ecoJobProcessor } from '../jobs/ecoJobs';
import { logger } from '../utils/logger';
import { MetricsService } from './metrics.service';
import { CacheService } from './cache.service';

export class EcoService {
  private metricsService: MetricsService;
  private cacheService: CacheService;

  constructor() {
    this.metricsService = new MetricsService();
    this.cacheService = new CacheService();
  }

  async recordEcoActivity(data: {
    groupId: number;
    emissionsReduced: number;
    savings: number;
    resourcesShared: number;
  }) {
    const timer = this.metricsService.getHistogram(
      'eco_activity_recording_duration',
      'Time taken to record eco activity'
    ).startTimer();

    try {
      await prisma.$transaction(async (tx) => {
        // Record the activity
        await tx.ecoAnalytics.create({
          data: {
            ...data,
            date: new Date()
          }
        });

        // Update group totals
        await tx.group.update({
          where: { id: data.groupId },
          data: {
            totalEmissionsReduced: { increment: data.emissionsReduced },
            totalSavings: { increment: data.savings },
            totalResourcesShared: { increment: data.resourcesShared }
          }
        });
      });

      // Queue impact recalculation
      await ecoJobProcessor.queueImpactRecalculation(data.groupId);

      // Increment metrics
      this.metricsService.getCounter(
        'eco_activities_recorded_total',
        'Total number of eco activities recorded'
      ).inc();

      // Invalidate cache
      await this.cacheService.invalidate(`group:${data.groupId}:*`);

    } catch (error) {
      logger.error('Error recording eco activity:', error);
      throw error;
    } finally {
      timer();
    }
  }
}

export const ecoService = new EcoService(); 
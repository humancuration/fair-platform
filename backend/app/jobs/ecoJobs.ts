import { QueueService } from '../services/queue.service';
import { MetricsService } from '../services/metrics.service';
import { CacheService } from '../services/cache.service';
import { SearchService } from '../services/search.service';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// Job type definitions
const RecalculateImpactJobSchema = z.object({
  groupId: z.number(),
  forceRefresh: z.boolean().default(false)
});

const IndexEcoTipJobSchema = z.object({
  tipId: z.number(),
  action: z.enum(['create', 'update', 'delete'])
});

export class EcoJobProcessor {
  private queueService: QueueService;
  private metricsService: MetricsService;
  private cacheService: CacheService;
  private searchService: SearchService;

  constructor() {
    this.queueService = new QueueService();
    this.metricsService = new MetricsService();
    this.cacheService = new CacheService();
    this.searchService = new SearchService();

    // Set up job processors
    this.setupProcessors();
  }

  private async setupProcessors() {
    // Process impact recalculations
    await this.queueService.processQueue<z.infer<typeof RecalculateImpactJobSchema>>(
      'recalculateImpact',
      async (job) => {
        const timer = this.metricsService.getHistogram(
          'eco_impact_recalculation_duration',
          'Time taken to recalculate eco impact'
        ).startTimer();

        try {
          const { groupId, forceRefresh } = job.data;

          // Check cache if not forcing refresh
          if (!forceRefresh) {
            const cached = await this.cacheService.get(
              `group:${groupId}:impact`,
              z.object({
                totalCarbonOffset: z.number(),
                totalSavings: z.number(),
                resourcesShared: z.number()
              })
            );
            if (cached) return cached;
          }

          // Recalculate impact
          const impact = await prisma.ecoAnalytics.aggregate({
            where: { groupId },
            _sum: {
              emissionsReduced: true,
              savings: true,
              resourcesShared: true
            }
          });

          // Update cache
          await this.cacheService.set(
            `group:${groupId}:impact`,
            impact._sum,
            3600 // 1 hour TTL
          );

          // Track metric
          this.metricsService.getCounter(
            'eco_impact_recalculations_total',
            'Total number of eco impact recalculations'
          ).inc();

          return impact._sum;
        } finally {
          timer();
        }
      }
    );

    // Process eco tip indexing
    await this.queueService.processQueue<z.infer<typeof IndexEcoTipJobSchema>>(
      'indexEcoTip',
      async (job) => {
        const { tipId, action } = job.data;

        if (action === 'delete') {
          await this.searchService.client.delete({
            index: 'eco-tips',
            id: tipId.toString()
          });
          return;
        }

        const tip = await prisma.ecoTip.findUnique({
          where: { id: tipId },
          include: {
            author: {
              select: {
                username: true
              }
            }
          }
        });

        if (!tip) return;

        await this.searchService.index('eco-tips', tipId.toString(), {
          title: tip.title,
          description: tip.description,
          category: tip.category,
          impact: tip.impact,
          author: tip.author.username,
          likes: tip.likes,
          createdAt: tip.createdAt
        });
      }
    );
  }

  // Public methods to add jobs
  async queueImpactRecalculation(groupId: number, forceRefresh = false) {
    return this.queueService.addJob('recalculateImpact', {
      groupId,
      forceRefresh
    });
  }

  async queueEcoTipIndex(tipId: number, action: 'create' | 'update' | 'delete') {
    return this.queueService.addJob('indexEcoTip', {
      tipId,
      action
    });
  }

  // Cleanup method
  async shutdown() {
    await this.queueService.closeQueues();
  }
}

// Export singleton instance
export const ecoJobProcessor = new EcoJobProcessor(); 
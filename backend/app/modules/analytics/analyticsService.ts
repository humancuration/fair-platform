import { Client } from '@opensearch-project/opensearch';
import { Counter, Histogram } from 'prom-client';
import { Server as SocketServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { logger } from '../../utils/logger';
import { redisClient } from '../../utils/redis';
import { trace, context } from '@opentelemetry/api';
import { AnalyticsEvent, AggregateOptions } from './types';
import { AnalyticsEventSchema } from './types';

export class AnalyticsService {
  private prisma: PrismaClient;
  private opensearchClient: Client;
  private io: SocketServer;
  private readonly metricsPrefix = 'analytics_';

  private eventCounter: Counter<string>;
  private eventProcessingDuration: Histogram<string>;

  constructor(prisma: PrismaClient, opensearchClient: Client, io: SocketServer) {
    this.prisma = prisma;
    this.opensearchClient = opensearchClient;
    this.io = io;

    this.eventCounter = new Counter({
      name: this.metricsPrefix + 'events_total',
      help: 'Total number of analytics events tracked',
      labelNames: ['eventType']
    });

    this.eventProcessingDuration = new Histogram({
      name: this.metricsPrefix + 'event_processing_duration_seconds',
      help: 'Duration of event processing in seconds',
      buckets: [0.1, 0.5, 1, 2, 5]
    });
  }

  async trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent> {
    const span = trace.getTracer('analytics-service').startSpan('trackEvent');
    const timer = this.eventProcessingDuration.startTimer();

    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const validatedEvent = AnalyticsEventSchema.parse({
          ...event,
          id: randomUUID(),
          timestamp: new Date()
        });

        const [dbEvent] = await Promise.all([
          this.prisma.analyticsEvent.create({
            data: validatedEvent
          }),
          this.opensearchClient.index({
            index: 'analytics-events',
            body: validatedEvent
          })
        ]);

        this.eventCounter.inc({ eventType: event.eventType });
        this.io.emit('analytics:event', validatedEvent);
        await this.invalidateAggregateCache(event.eventType);

        logger.info('Event tracked', { 
          userId: event.userId,
          eventType: event.eventType 
        });

        return dbEvent;
      } catch (error) {
        logger.error('Error tracking event', { 
          userId: event.userId,
          eventType: event.eventType,
          error 
        });
        span.recordException(error as Error);
        throw new Error('Failed to track event');
      } finally {
        span.end();
        timer();
      }
    });
  }

  async getAggregateData(options: AggregateOptions) {
    const span = trace.getTracer('analytics-service').startSpan('getAggregateData');
    
    return context.with(trace.setSpan(context.active(), span), async () => {
      const cacheKey = `aggregateData:${JSON.stringify(options)}`;
      
      try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }

        const searchResponse = await this.opensearchClient.search({
          index: 'analytics-events',
          body: {
            query: {
              bool: {
                must: [
                  {
                    range: {
                      timestamp: {
                        gte: options.startDate.toISOString(),
                        lte: options.endDate.toISOString()
                      }
                    }
                  },
                  ...(options.filters ? [{ match: options.filters }] : [])
                ]
              }
            },
            aggs: {
              groupBy: {
                terms: {
                  field: options.groupBy || ['eventType']
                }
              }
            }
          }
        });

        const results = searchResponse.body.aggregations.groupBy.buckets;
        await redisClient.setex(cacheKey, 3600, JSON.stringify(results));
        
        return results;
      } catch (error) {
        logger.error('Error getting aggregate data', { error });
        span.recordException(error as Error);
        throw new Error('Failed to get aggregate data');
      } finally {
        span.end();
      }
    });
  }

  private async invalidateAggregateCache(eventType: string): Promise<void> {
    const keys = await redisClient.keys(`aggregateData:*${eventType}*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
}

// Initialize service with proper dependencies
const analyticsService = new AnalyticsService(
  new PrismaClient(),
  new Client({ node: process.env.OPENSEARCH_URL }),
  (global as any).io // Type assertion for global io
);

export default analyticsService;

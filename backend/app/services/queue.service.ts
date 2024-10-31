import { Queue, Worker, Job, QueueOptions } from 'bullmq';
import { logger } from '../utils/logger';
import { Redis } from 'ioredis';

export class QueueService {
  private queues: Map<string, Queue>;
  private workers: Map<string, Worker>;
  private connection: Redis;

  constructor() {
    this.queues = new Map();
    this.workers = new Map();
    this.connection = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null
    });
  }

  getQueue<T = any>(name: string, options?: Partial<QueueOptions>): Queue<T> {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        connection: this.connection,
        defaultJobOptions: {
          removeOnComplete: true,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          }
        },
        ...options
      });

      queue.on('error', error => {
        logger.error(`Queue ${name} error:`, error);
      });

      this.queues.set(name, queue);
    }

    return this.queues.get(name)!;
  }

  async addJob<T = any>(
    queueName: string, 
    data: T, 
    options?: {
      priority?: number;
      delay?: number;
      attempts?: number;
      jobId?: string;
    }
  ): Promise<Job<T>> {
    const queue = this.getQueue<T>(queueName);
    return queue.add(queueName, data, options);
  }

  async processQueue<T = any>(
    queueName: string,
    processor: (job: Job<T>) => Promise<void>,
    options?: {
      concurrency?: number;
      limiter?: {
        max: number;
        duration: number;
      };
    }
  ): Promise<void> {
    if (this.workers.has(queueName)) {
      return;
    }

    const worker = new Worker(
      queueName,
      async job => {
        try {
          await processor(job);
        } catch (error) {
          logger.error(`Error processing job ${job.id} in queue ${queueName}:`, error);
          throw error;
        }
      },
      {
        connection: this.connection,
        concurrency: options?.concurrency || 1,
        limiter: options?.limiter,
      }
    );

    worker.on('completed', job => {
      logger.info(`Job ${job.id} completed in queue ${queueName}`);
    });

    worker.on('failed', (job, error) => {
      logger.error(`Job ${job?.id} failed in queue ${queueName}:`, error);
    });

    this.workers.set(queueName, worker);
  }

  async closeQueues(): Promise<void> {
    await Promise.all([
      ...Array.from(this.queues.values()).map(queue => queue.close()),
      ...Array.from(this.workers.values()).map(worker => worker.close()),
      this.connection.quit()
    ]);
  }
} 
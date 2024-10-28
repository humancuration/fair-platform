import { Request, Response, NextFunction } from 'express';
import { Counter, Histogram } from 'prom-client';
import logger from '../utils/logger';

// Create metrics
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, path } = req;

  // Record end time and metrics on response finish
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const statusCode = res.statusCode.toString();

    // Record metrics
    httpRequestDuration
      .labels(method, path, statusCode)
      .observe(duration);

    httpRequestTotal
      .labels(method, path, statusCode)
      .inc();

    // Log request details
    logger.info('Request processed', {
      method,
      path,
      statusCode,
      duration: `${duration}s`
    });
  });

  next();
};

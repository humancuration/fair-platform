import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateJWT } from './auth';
import { errorHandler } from './error';
import { validate, paginationValidation } from './validation';
import { cache, invalidateCache } from './cache';
import { checkPermissions, checkOwnership } from './permissions';
import { metricsMiddleware } from './metrics';
import { sanitizeBody, escapeQueryParams } from './sanitization';
import { createCompression, compressionErrorHandler } from './compression';
import { createSecurityHeaders, securityErrorHandler } from './security';
import logger from '../utils/logger';

// Re-export all middlewares
export {
  authenticateJWT,
  errorHandler,
  validate,
  paginationValidation,
  cache,
  invalidateCache,
  checkPermissions,
  checkOwnership,
  metricsMiddleware,
  sanitizeBody,
  escapeQueryParams,
  createCompression,
  compressionErrorHandler,
  createSecurityHeaders,
  securityErrorHandler
};

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
};

// Response time middleware
export const responseTime = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} completed in ${duration}ms`);
  });
  next();
};

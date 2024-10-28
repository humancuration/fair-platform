import compression from 'compression';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface CompressionOptions {
  level?: number;
  threshold?: number;
  filter?: (req: Request, res: Response) => boolean;
}

export const createCompression = (options: CompressionOptions = {}) => {
  const defaultFilter = (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }

    // Compress for the following content types
    const compressibleTypes = [
      'text/html',
      'text/css',
      'text/plain',
      'text/xml',
      'application/json',
      'application/javascript',
      'application/x-javascript',
      'application/xml',
      'application/x-yaml',
      'application/ld+json'
    ];

    const contentType = res.getHeader('Content-Type') as string;
    return compressibleTypes.some(type => contentType?.includes(type));
  };

  return compression({
    level: options.level || 6, // Default compression level
    threshold: options.threshold || 1024, // Min size to compress (1KB)
    filter: options.filter || defaultFilter,
    ...options
  });
};

// Middleware to handle compression errors
export const compressionErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message.includes('compression')) {
    logger.error('Compression error:', err);
    // Continue without compression
    next();
  } else {
    next(err);
  }
};

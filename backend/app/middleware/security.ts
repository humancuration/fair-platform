import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import logger from '../utils/logger';

interface SecurityOptions {
  enableHSTS?: boolean;
  enableNoSniff?: boolean;
  enableXSSFilter?: boolean;
  enableFrameGuard?: boolean;
  referrerPolicy?: string;
  contentSecurityPolicy?: boolean | { [key: string]: string[] };
}

export const createSecurityHeaders = (options: SecurityOptions = {}) => {
  const middleware = [
    // Basic security headers
    helmet({
      contentSecurityPolicy: options.contentSecurityPolicy !== false ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          ...(typeof options.contentSecurityPolicy === 'object' ? options.contentSecurityPolicy : {})
        }
      } : false,
      hsts: options.enableHSTS !== false ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      } : false,
      noSniff: options.enableNoSniff !== false,
      xssFilter: options.enableXSSFilter !== false,
      frameguard: options.enableFrameGuard !== false ? { action: 'deny' } : false,
      referrerPolicy: { policy: options.referrerPolicy || 'same-origin' }
    }),

    // Additional security headers
    (req: Request, res: Response, next: NextFunction) => {
      // Feature Policy
      res.setHeader('Permissions-Policy', 
        'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=()');
      
      // Cross-Origin headers
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

      next();
    }
  ];

  return middleware;
};

// Security error handling middleware
export const securityErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'SecurityError') {
    logger.error('Security middleware error:', err);
    res.status(403).json({ 
      error: 'Security policy violation',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Access denied'
    });
  } else {
    next(err);
  }
};

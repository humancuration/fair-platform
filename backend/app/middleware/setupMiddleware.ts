import express, { Express } from 'express';
import { authenticateJWT } from './auth';
import { errorHandler } from './errorHandler';
import { validate } from './validate';
import { activityLogger } from './activityLogger';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { addRequestId, expressLogger, expressErrorLogger } from '../utils/logger';

export const setupMiddleware = (app: Express) => {
  // Add request ID to each request
  app.use(addRequestId);

  // Request logging
  app.use(expressLogger);

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? 'https://yourdomain.com'
      : 'http://localhost:3000',
    credentials: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // JSON body parser with size limit
  app.use(express.json({ limit: '10kb' }));

  // Cookie parser
  app.use(cookieParser());

  // Session management
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication middleware
  app.use(authenticateJWT);

  // Example of using activity logger on specific routes
  app.use('/api/someRoute', activityLogger('someActivityType'));

  // Validation middleware
  app.use(validate);

  // Error logging (should be right before the error handler)
  app.use(expressErrorLogger);

  // Error handling middleware (should be last)
  app.use(errorHandler);
};

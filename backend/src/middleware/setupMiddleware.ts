import { Express } from 'express';
import { authenticateJWT } from './auth';
import { errorHandler } from './errorHandler';
import { validate } from './validate';
import { activityLogger } from './activityLogger';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';

export const setupMiddleware = (app: Express) => {
  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? 'https://yourdomain.com'
      : 'http://localhost:3000',
    credentials: true,
  }));

  // JSON body parser
  app.use(express.json({ limit: '10kb' }));

  // Session management
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  }));

  // Authentication middleware
  app.use(authenticateJWT);

  // Example of using activity logger on specific routes
  app.use('/api/someRoute', activityLogger('someActivityType'));

  // Validation middleware
  app.use(validate);

  // Error handling middleware
  app.use(errorHandler);
};

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import { 
  errorHandler, 
  rateLimiter, 
  requestLogger, 
  responseTime 
} from '../middleware';
import routes from '../routes';

export function configureExpress(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(rateLimiter);

  // Basic middleware
  app.use(compression());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true }));
  
  // Logging middleware
  app.use(morgan('dev'));
  app.use(requestLogger);
  app.use(responseTime);

  // API routes
  app.use('/api', routes);

  // Error handling
  app.use(errorHandler);

  return app;
}

export default configureExpress;

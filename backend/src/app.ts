import express from 'express';
import { App } from 'uWebSockets.js';
import SurveyController from './controllers/SurveyController';
import surveyRoutes from './routes/surveyRoutes';
import searchRoutes from './routes/searchRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import dataRetentionTask from './tasks/dataRetentionTask';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { sequelize } from './config/database'; // Sequelize instance

const app = express();
const uWS = App();

app.use(express.json());
app.use('/api/surveys', surveyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Error handling middleware
app.use(errorHandler);

// Connect to the SQL database (replace MongoDB connection)
sequelize.authenticate()
  .then(() => {
    console.log('Connected to SQL database');
    return sequelize.sync();  // Synchronize models
  })
  .catch((err) => console.error('SQL connection error:', err));

// Set up uWebSockets.js
uWS.ws('/surveys/:surveyId', {
  open: (ws) => {
    const surveyId = ws.getParameter(0);
    SurveyController.handleWebSocket(ws, surveyId);
  },
  message: (ws, message, isBinary) => {
    const surveyId = ws.getParameter(0);
    SurveyController.handleMessage(ws, surveyId, Buffer.from(message).toString());
  },
  close: (ws) => {
    SurveyController.handleDisconnect(ws);
  }
});

// Serve Express app through uWebSockets.js
uWS.any('/*', (res, req) => {
  app(req, res);
});

// Start data retention task
dataRetentionTask();

app.use(helmet());

export { uWS as server };
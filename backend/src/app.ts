import express from 'express';
import { App } from 'uWebSockets.js';
import SurveyController from './controllers/SurveyController';
import mongoose from 'mongoose';
import surveyRoutes from './routes/surveyRoutes';
import searchRoutes from './routes/searchRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import dataRetentionTask from './tasks/dataRetentionTask';

const app = express();
const uWS = App();

app.use(express.json());
app.use('/api/surveys', surveyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fairplatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

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

export { uWS as server };
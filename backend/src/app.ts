import express from 'express';
import { Server } from 'socket.io';
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
import { createServer } from 'http';
import versionControlRoutes from './routes/versionControlRoutes';
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use('/api/surveys', surveyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/version-control', versionControlRoutes);

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

// Set up Socket.IO
io.of('/surveys').on('connection', (socket) => {
  const surveyId = socket.handshake.query.surveyId as string;
  
  SurveyController.handleSocket(socket, surveyId);

  socket.on('message', (message: string) => {
    // Use a public method to handle the message
    SurveyController.processMessage(socket, surveyId, message);
  });

  socket.on('disconnect', () => {
    SurveyController.onDisconnect(socket);
  });
});
// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Start data retention task
dataRetentionTask();

app.use(helmet());

export { io as server };

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { setupApolloServer } from '@graphql/setupApolloServer';
import { setupSocketIO } from '@socket/setupSocketIO';
import { setupSwagger } from '@config/setupSwagger';
import { errorHandler } from '@middleware/errorHandler';
import dataRetentionTask from '@tasks/dataRetentionTask';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { sequelize } from './config/database';
import dotenv from 'dotenv';

// Import routes
import surveyRoutes from './routes/surveyRoutes';
import searchRoutes from './routes/searchRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import userRoutes from './routes/userRoutes';
import versionControlRoutes from './routes/versionControlRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import avatarRoutes from './routes/avatarRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Routes
app.use('/api/surveys', surveyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/version-control', versionControlRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api', avatarRoutes);

// Setup Swagger
setupSwagger(app);

// Error handling middleware
app.use(errorHandler);

// Connect to the SQL database
sequelize.authenticate()
  .then(() => {
    console.log('Connected to SQL database');
    return sequelize.sync();
  })
  .catch((err) => console.error('SQL connection error:', err));

// Setup Apollo Server
setupApolloServer(app, httpServer);

// Setup Socket.IO
const io = setupSocketIO(httpServer);

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Start data retention task
dataRetentionTask();

export { io as server };

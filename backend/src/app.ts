import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { setupApolloServer } from './graphql/setupApolloServer';
import { setupSocketIO } from './socket/setupSocketIO';
import { setupSwagger } from './config/setupSwagger';
import { errorHandler } from './middleware/errorHandler';
import dataRetentionTask from './modules/analytics/dataRetentionTask';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { sequelize } from './config/database';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { userAPI } from './api/UserAPI';
import { startDiscordBot } from './integrations/discord/discordBot';

// Import routes
import surveyRoutes from './modules/survey/surveyRoutes';
import searchRoutes from './routes/searchRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import userRoutes from './modules/user/userRoutes';
import versionControlRoutes from './routes/versionControlRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import avatarRoutes from './routes/avatarRoutes';
import rewardRoutes from './modules/campaign/rewardRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(json());
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
app.use('/api', rewardRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

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
setupApolloServer(app, httpServer).then(() => {
  console.log('Apollo Server setup complete');
});

// Setup Socket.IO
const io = setupSocketIO(httpServer);

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
});

// Start data retention task
dataRetentionTask();

// Start the Discord bot
if (process.env.ENABLE_DISCORD_BOT === 'true') {
  startDiscordBot();
}

export { app, httpServer, io };

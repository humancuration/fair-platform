import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import { setupApolloServer } from './graphql/setupApolloServer';
import { setupSocketIO } from './socket/setupSocketIO';
import { setupSwagger } from './config/setupSwagger';
import { errorHandler } from './middleware/errorHandler';
import dataRetentionTask from './modules/analytics/dataRetentionTask';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { userAPI } from './api/UserAPI';
import { startDiscordBot } from './integrations/discord/discordBot';
import { Client } from '@opensearch-project/opensearch';
import Redis from 'ioredis';
import promClient from 'prom-client';
import responseTime from 'response-time';

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

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Initialize OpenSearch
const opensearch = new Client({
  node: process.env.OPENSEARCH_URL || 'http://localhost:9200'
});

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'api_' });

// Custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(json());
app.use(helmet());

// Add response time monitoring
app.use(responseTime((req, res, time) => {
  if (req?.route?.path) {
    httpRequestDurationMicroseconds
      .labels(req.method, req.route.path, res.statusCode.toString())
      .observe(time / 1000);
  }
}));

// Redis-based rate limiting
const rateLimitRedis = async (req, res, next) => {
  const key = `ratelimit:${req.ip}`;
  const limit = 100;
  const windowMs = 15 * 60 * 1000; // 15 minutes

  try {
    const requests = await redis.incr(key);
    if (requests === 1) {
      await redis.expire(key, windowMs / 1000);
    }
    
    if (requests > limit) {
      return res.status(429).json({
        message: 'Too many requests from this IP, please try again later.'
      });
    }
    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    next();
  }
};

app.use(rateLimitRedis);

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

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

// Connect to Prisma
prisma.$connect()
  .then(() => {
    console.log('Connected to database via Prisma');
  })
  .catch((error: Error) => {
    console.error('Prisma connection error:', error);
    process.exit(1);
  });

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

// Cleanup function
const cleanup = async () => {
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
};

// Handle graceful shutdown
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

export { app, httpServer, io, prisma, redis, opensearch };

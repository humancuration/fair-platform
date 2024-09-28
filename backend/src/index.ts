import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import { Server } from 'socket.io';
import { connectToDatabase } from './config/database';
import authRoutes from './routes/auth';
import companyRoutes from './routes/companies';
import productRoutes from './routes/products';
import dividendRoutes from './routes/dividends';
import grantRoutes from './routes/grants';
import analyticsRoutes from './routes/analytics';
import forumRoutes from './routes/forums';
import postRoutes from './routes/posts';
import { errorHandler } from './middleware/errorHandler';
import marketplaceRoutes from './routes/marketplace';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced security middleware
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'trusted-cdn.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'trusted-cdn.com'],
    imgSrc: ["'self'", 'data:', 'trusted-cdn.com'],
    connectSrc: ["'self'", 'api.example.com'],
    fontSrc: ["'self'", 'trusted-cdn.com'],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
}));
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

// Strict CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' })); // Limit body size

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter); // Apply rate limiting to all API routes

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fair Platform API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dividends', dividendRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Example: Emit a new notification
  // This should be triggered by your backend logic when a relevant event occurs
  socket.emit('newNotification', {
    id: 1,
    message: 'Welcome to the platform!',
    read: false,
    timestamp: new Date().toISOString(),
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
startServer();

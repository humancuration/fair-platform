// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { sequelize } from './models'; // Ensure correct path
import authRoutes from './routes/auth';
import companyRoutes from './routes/companies';
import productRoutes from './routes/products';
import dividendRoutes from './routes/dividends';
import grantRoutes from './routes/grants';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import analyticsRoutes from './routes/analytics';
import forumRoutes from './routes/forums';
import postRoutes from './routes/posts';
import path from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware (Helmet for securing HTTP headers)
app.use(helmet());

// Rate limiting middleware (limits IP requests to prevent abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Cross-Origin Resource Sharing (CORS) middleware
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());
// Swagger Setup (if already configured)
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Affiliate Link Management API',
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
  apis: ['./routes/*.ts'], // Path to the API docs
};
// API routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dividends', dividendRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/posts', postRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


// Serve frontend build files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
  });
}
// Database Connection and Server Start
sequelize.sync({ alter: true }) // Use 'force: true' for development to reset tables
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
// Sync database (ensure database connection and model synchronization)
sequelize
  .sync({ force: false }) // Set force: true to reset the database (use with caution in production)
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

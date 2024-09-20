import app from './app';
import { sequelize } from './models';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Swagger setup
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


const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', routes);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;
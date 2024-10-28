import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Your API',
        version: '1.0.0',
        description: 'API documentation for your Express TypeScript project',
      },
      servers: [
        {
          url: 'http://localhost:5000', // Update this to your server's URL
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API routes
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
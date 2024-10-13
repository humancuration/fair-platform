import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { setupApolloServer } from './graphql/setupApolloServer';
import { UserAPI } from '@api/UserAPI'; // Adjust the import path as necessary
import { GroupAPI } from '@api/GroupAPI'; // Adjust the import path as necessary
import { setupSocketIO } from './socket/setupSocketIO';
import { setupMiddleware } from './middleware/setupMiddleware';
import { setupSwagger } from '@config/setupSwagger';
const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors());
app.use(json());

// Setup middleware
setupMiddleware(app);

// Setup Apollo Server
setupApolloServer(app, httpServer).then(() => {
  console.log('Apollo Server setup complete');
});

// Setup Socket.IO
const io = setupSocketIO(httpServer);

// You can add other Express routes here if needed
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', userController.getUsers);
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
});

// Export io if needed elsewhere in your application
export { io };

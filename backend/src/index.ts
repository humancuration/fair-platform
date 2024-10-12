import 'reflect-metadata'; // Import this at the top
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { setupMiddleware } from './middleware/setupMiddleware';
import { setupRoutes } from './routes/setupRoutes';
import { setupApolloServer } from './graphql/setupApolloServer';
import { connectToDatabase } from '@config/database';
import { setupSocketIO } from './socket/setupSocketIO';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDatabase();

    setupMiddleware(app);
    setupRoutes(app);
    await setupApolloServer(app, httpServer);
    setupSocketIO(io);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupMiddleware } from './middleware/setupMiddleware';
import { setupRoutes } from './routes/setupRoutes';
import { setupApolloServer } from './graphql/setupApolloServer';
import { connectToDatabase } from '@config/database';
import routes from './routes';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

async function startServer() {
  try {
    await connectToDatabase();

    setupMiddleware(app);
    setupRoutes(app);
    await setupApolloServer(app, httpServer);

    // Socket.io setup
    io.on('connection', (socket: Socket) => {
      console.log('A user connected:', socket.id);

      // Group-related events
      socket.on('joinGroup', (groupId: string) => {
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined group ${groupId}`);
      });

      socket.on('leaveGroup', (groupId: string) => {
        socket.leave(groupId);
        console.log(`Socket ${socket.id} left group ${groupId}`);
      });

      // Version control events
      socket.on('repoUpdate', (data: any) => {
        io.emit('repoUpdated', data);
        console.log(`Repository update received:`, data);
      });

      socket.on('commitCreated', (data: any) => {
        io.to(data.repoId).emit('newCommit', data);
        console.log(`New commit in repository ${data.repoId}:`, data);
      });

      socket.on('branchCreated', (data: any) => {
        io.to(data.repoId).emit('newBranch', data);
        console.log(`New branch in repository ${data.repoId}:`, data);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      });
    });

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
export { io };

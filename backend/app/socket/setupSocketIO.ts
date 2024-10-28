import { Server, Socket } from 'socket.io';

export const setupSocketIO = (server: any) => {
  const io = new Server(server, {
    // Add any necessary configurations here
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

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
      // Handle repository updates
      io.emit('repoUpdated', data);
      console.log(`Repository update received:`, data);
    });

    // You can add more version control related events here
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

  return io;
};

export default setupSocketIO;

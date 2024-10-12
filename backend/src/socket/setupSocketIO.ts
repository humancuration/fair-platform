import { Server } from 'socket.io';

export const setupSocketIO = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGroup', (groupId: string) => {
      socket.join(groupId);
      console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on('leaveGroup', (groupId: string) => {
      socket.leave(groupId);
      console.log(`Socket ${socket.id} left group ${groupId}`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};

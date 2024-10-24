import { Server } from 'socket.io';
import logger from '../utils/logger';

export class VersionControlWebSocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info('Client connected to version control updates');

      socket.on('subscribe-repo', (repoId: string) => {
        socket.join(`repo-${repoId}`);
        logger.info(`Client subscribed to repo ${repoId}`);
      });

      socket.on('disconnect', () => {
        logger.info('Client disconnected from version control updates');
      });
    });
  }

  public notifyRepoUpdate(repoId: string, updateType: string, data: any) {
    this.io.to(`repo-${repoId}`).emit('repo-update', {
      type: updateType,
      data
    });
  }
}

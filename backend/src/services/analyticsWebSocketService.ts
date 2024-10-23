import { Server } from 'socket.io';
import { redisClient } from '../config/redis';

export class AnalyticsWebSocketService {
  private io: Server;
  private updateInterval: NodeJS.Timeout;

  constructor(io: Server) {
    this.io = io;
    this.setupWebSocket();
    this.startPeriodicUpdates();
  }

  private setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log('Client connected to analytics socket');

      socket.on('join-analytics', async () => {
        socket.join('analytics-room');
        await this.sendLatestAnalytics(socket);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected from analytics socket');
      });
    });
  }

  private async sendLatestAnalytics(socket: any) {
    try {
      const realtimeViewers = await redisClient.get('marketplace:activeUsers');
      const salesData = await this.getLatestSalesData();
      
      socket.emit('analytics-update', {
        realtimeViewers: parseInt(realtimeViewers || '0'),
        ...salesData
      });
    } catch (error) {
      console.error('Error sending analytics update:', error);
    }
  }

  private async getLatestSalesData() {
    // Implement real-time sales data fetching logic
    return {
      todaySales: 0,
      conversionRate: 0,
      // Add other metrics as needed
    };
  }

  private startPeriodicUpdates() {
    // Update connected clients every 30 seconds
    this.updateInterval = setInterval(async () => {
      const sockets = await this.io.in('analytics-room').fetchSockets();
      for (const socket of sockets) {
        await this.sendLatestAnalytics(socket);
      }
    }, 30000);
  }

  public stopPeriodicUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

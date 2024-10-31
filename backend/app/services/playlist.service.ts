import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { logger } from '../utils/logger';

export class PlaylistService {
  async getPlaylistData(playlistId: string) {
    try {
      // Check cache first
      const cached = await redis.get(`playlist:${playlistId}`);
      if (cached) return JSON.parse(cached);

      const playlist = await prisma.playlist.findUnique({
        where: { id: playlistId },
        include: {
          tracks: true,
          currentTrack: true,
          settings: true,
          contributors: true,
          stats: true
        }
      });

      if (!playlist) {
        throw new Error("Playlist not found");
      }

      // Cache result
      await redis.setex(`playlist:${playlistId}`, 300, JSON.stringify(playlist));

      return playlist;
    } catch (error) {
      logger.error('Error fetching playlist:', error);
      throw error;
    }
  }

  async togglePlayState(playlistId: string) {
    try {
      const result = await prisma.playlistSettings.update({
        where: { playlistId },
        data: {
          isPlaying: {
            set: (settings) => !settings.isPlaying,
          },
        },
      });

      // Invalidate cache
      await redis.del(`playlist:${playlistId}`);

      return result;
    } catch (error) {
      logger.error('Error toggling play state:', error);
      throw error;
    }
  }

  // ... other methods
}

export const playlistService = new PlaylistService(); 
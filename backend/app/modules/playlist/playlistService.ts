import { PrismaClient } from '@prisma/client';
import { CreatePlaylistInput, UpdatePlaylistInput, MediaItemInput } from './types';
import { logger } from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export class PlaylistService {
  async createPlaylist(userId: number, input: CreatePlaylistInput) {
    try {
      const playlist = await prisma.playlist.create({
        data: {
          ...input,
          userId,
          mediaItems: [],
        },
        include: {
          user: true,
          group: true,
        },
      });
      
      logger.info(`Playlist created: ${playlist.id}`);
      return playlist;
    } catch (error) {
      logger.error('Error creating playlist:', error);
      throw error;
    }
  }

  async getUserPlaylists(userId: number) {
    try {
      return await prisma.playlist.findMany({
        where: { userId },
        include: {
          user: true,
          group: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error('Error fetching user playlists:', error);
      throw error;
    }
  }

  async getGroupPlaylists(groupId: number) {
    try {
      return await prisma.playlist.findMany({
        where: { 
          groupId,
          visibility: 'PUBLIC',
        },
        include: {
          user: true,
          group: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error('Error fetching group playlists:', error);
      throw error;
    }
  }

  async updatePlaylist(id: string, userId: number, input: UpdatePlaylistInput) {
    try {
      const playlist = await prisma.playlist.findFirst({
        where: { id, userId },
      });

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      return await prisma.playlist.update({
        where: { id },
        data: input,
        include: {
          user: true,
          group: true,
        },
      });
    } catch (error) {
      logger.error('Error updating playlist:', error);
      throw error;
    }
  }

  async addMediaItem(playlistId: string, userId: number, input: MediaItemInput) {
    try {
      const playlist = await prisma.playlist.findFirst({
        where: { id: playlistId, userId },
      });

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      const mediaItem = {
        id: uuidv4(),
        ...input,
        order: playlist.mediaItems.length,
      };

      const updatedPlaylist = await prisma.playlist.update({
        where: { id: playlistId },
        data: {
          mediaItems: {
            push: mediaItem,
          },
        },
      });

      return mediaItem;
    } catch (error) {
      logger.error('Error adding media item:', error);
      throw error;
    }
  }

  async reorderMediaItems(playlistId: string, userId: number, mediaItemIds: string[]) {
    try {
      const playlist = await prisma.playlist.findFirst({
        where: { id: playlistId, userId },
      });

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      const reorderedItems = mediaItemIds.map((id, index) => {
        const item = playlist.mediaItems.find(item => item.id === id);
        return { ...item, order: index };
      });

      return await prisma.playlist.update({
        where: { id: playlistId },
        data: {
          mediaItems: reorderedItems,
        },
        include: {
          user: true,
          group: true,
        },
      });
    } catch (error) {
      logger.error('Error reordering media items:', error);
      throw error;
    }
  }

  async removeMediaItem(playlistId: string, userId: number, mediaItemId: string) {
    try {
      const playlist = await prisma.playlist.findFirst({
        where: { id: playlistId, userId },
      });

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      await prisma.playlist.update({
        where: { id: playlistId },
        data: {
          mediaItems: playlist.mediaItems.filter(item => item.id !== mediaItemId),
        },
      });

      return true;
    } catch (error) {
      logger.error('Error removing media item:', error);
      throw error;
    }
  }

  async sharePlaylist(id: string, userId: number, groupId: number) {
    try {
      const playlist = await prisma.playlist.findFirst({
        where: { id, userId },
      });

      if (!playlist) {
        throw new Error('Playlist not found');
      }

      return await prisma.playlist.update({
        where: { id },
        data: {
          groupId,
          visibility: 'PUBLIC',
        },
        include: {
          user: true,
          group: true,
        },
      });
    } catch (error) {
      logger.error('Error sharing playlist:', error);
      throw error;
    }
  }
}

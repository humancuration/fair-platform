import { ApolloError } from '@apollo/server/errors';
import { logger } from '../../utils/logger';
import { PlaylistService } from './playlistService';
import { Context } from '../../types/context';
import {
  Playlist,
  MediaItem,
  CreatePlaylistInput,
  UpdatePlaylistInput,
  MediaItemInput,
} from './types';

const playlistService = new PlaylistService();

export const playlistResolvers = {
  Query: {
    playlist: async (_: any, { id }: { id: string }, ctx: Context) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await playlistService.getPlaylist(id, ctx.user.id);
      } catch (error) {
        logger.error('Error in playlist query:', error);
        throw error;
      }
    },

    userPlaylists: async (_: any, __: any, ctx: Context) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await playlistService.getUserPlaylists(ctx.user.id);
      } catch (error) {
        logger.error('Error in userPlaylists query:', error);
        throw error;
      }
    },

    groupPlaylists: async (_: any, { groupId }: { groupId: number }) => {
      try {
        return await playlistService.getGroupPlaylists(groupId);
      } catch (error) {
        logger.error('Error in groupPlaylists query:', error);
        throw error;
      }
    },
  },

  Mutation: {
    createPlaylist: async (_: any, { input }: { input: CreatePlaylistInput }, ctx: Context) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await playlistService.createPlaylist(ctx.user.id, input);
      } catch (error) {
        logger.error('Error in createPlaylist mutation:', error);
        throw error;
      }
    },

    addMediaItem: async (
      _: any,
      { playlistId, input }: { playlistId: string; input: MediaItemInput },
      ctx: Context
    ) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await playlistService.addMediaItem(playlistId, ctx.user.id, input);
      } catch (error) {
        logger.error('Error in addMediaItem mutation:', error);
        throw error;
      }
    },

    reorderMediaItems: async (
      _: any,
      { playlistId, mediaItemIds }: { playlistId: string; mediaItemIds: string[] },
      ctx: Context
    ) => {
      if (!ctx.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }

      try {
        return await playlistService.reorderMediaItems(playlistId, ctx.user.id, mediaItemIds);
      } catch (error) {
        logger.error('Error in reorderMediaItems mutation:', error);
        throw error;
      }
    },
  },
};

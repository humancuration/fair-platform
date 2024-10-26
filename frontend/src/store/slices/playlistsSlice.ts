import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createStore } from 'zustand/vanilla';
import { json } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';

// Types
interface MediaItem {
  id: string;
  type: 'music' | 'video' | 'social' | 'podcast';
  title: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  mediaItems: MediaItem[];
  ownerId: string;
  groupId?: string;
  createdAt: string;
  totalDuration: number;
  playCount: number;
}

interface PlaylistStore {
  selectedPlaylistId: string | null;
  currentlyPlaying: MediaItem | null;
  isPlaying: boolean;
  setSelectedPlaylist: (id: string) => void;
  setCurrentlyPlaying: (item: MediaItem) => void;
  setIsPlaying: (playing: boolean) => void;
}

// Zustand store for local state management
export const playlistStore = createStore<PlaylistStore>((set) => ({
  selectedPlaylistId: null,
  currentlyPlaying: null,
  isPlaying: false,
  setSelectedPlaylist: (id: string) => set({ selectedPlaylistId: id }),
  setCurrentlyPlaying: (item: MediaItem) => set({ currentlyPlaying: item }),
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
}));

export const usePlaylistStore = () => playlistStore;

// Remix data hooks
export const usePlaylistsQuery = () => {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const response = await useFetcher().load('/api/playlists');
      return response as Playlist[];
    }
  });
};

export const useCreatePlaylistMutation = () => {
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (playlistData: { name: string; description: string; groupId?: string }) => {
      const response = await fetcher.submit(
        playlistData,
        { method: 'post', action: '/api/playlists' }
      );
      return response as Playlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    }
  });
};

export const useAddMediaItemMutation = () => {
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ playlistId, mediaItem }: { playlistId: string; mediaItem: MediaItem }) => {
      const response = await fetcher.submit(
        { mediaItem },
        { method: 'post', action: `/api/playlists/${playlistId}/media` }
      );
      return response as Playlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    }
  });
};

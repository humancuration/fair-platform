import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@api/api';

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
}

interface PlaylistsState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
}

const initialState: PlaylistsState = {
  playlists: [],
  loading: false,
  error: null,
};

// Async thunks for fetching, creating, and updating playlists
export const fetchPlaylists = createAsyncThunk('playlists/fetchPlaylists', async () => {
  const response = await api.get('/playlists');
  return response.data;
});

export const createPlaylist = createAsyncThunk(
  'playlists/createPlaylist',
  async (playlistData: { name: string; description: string; groupId?: string }) => {
    const response = await api.post('/playlists', playlistData);
    return response.data;
  }
);

export const addMediaItem = createAsyncThunk(
  'playlists/addMediaItem',
  async (payload: { playlistId: string; mediaItem: MediaItem }) => {
    const response = await api.post(`/playlists/${payload.playlistId}/media`, payload.mediaItem);
    return { playlistId: payload.playlistId, mediaItem: response.data };
  }
);

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    reorderMediaItems: (state, action: PayloadAction<{ playlistId: string; mediaItems: MediaItem[] }>) => {
      const playlist = state.playlists.find(pl => pl.id === action.payload.playlistId);
      if (playlist) {
        playlist.mediaItems = action.payload.mediaItems;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Playlists
      .addCase(fetchPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action: PayloadAction<Playlist[]>) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch playlists';
      })
      // Create Playlist
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.loading = false;
        state.playlists.push(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create playlist';
      })
      // Add Media Item
      .addCase(addMediaItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMediaItem.fulfilled, (state, action: PayloadAction<{ playlistId: string; mediaItem: MediaItem }>) => {
        state.loading = false;
        const playlist = state.playlists.find((pl) => pl.id === action.payload.playlistId);
        if (playlist) {
          playlist.mediaItems.push(action.payload.mediaItem);
        }
      })
      .addCase(addMediaItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add media item';
      });
  },
});

export const { reorderMediaItems } = playlistsSlice.actions;
export default playlistsSlice.reducer;
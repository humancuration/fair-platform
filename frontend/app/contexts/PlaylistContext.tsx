import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useHowl } from './UnifiedAudioContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaItem {
  id: string;
  type: 'music' | 'video' | 'social' | 'podcast';
  title: string;
  url: string;
  artwork?: string;
  artist?: string;
  duration?: number;
  waveformData?: number[];
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  mediaItems: MediaItem[];
  ownerId: string;
  groupId?: string;
  createdAt: string;
  artwork?: string;
  isPublic: boolean;
  tags: string[];
  totalDuration: number;
  playCount: number;
}

interface PlaylistState {
  currentPlaylist: Playlist | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
  queue: MediaItem[];
  history: MediaItem[];
}

type PlaylistAction =
  | { type: 'SET_PLAYLIST'; payload: Playlist }
  | { type: 'SET_TRACK_INDEX'; payload: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT'; payload: 'none' | 'all' | 'one' }
  | { type: 'ADD_TO_QUEUE'; payload: MediaItem }
  | { type: 'REMOVE_FROM_QUEUE'; payload: number }
  | { type: 'ADD_TO_HISTORY'; payload: MediaItem };

const PlaylistContext = createContext<{
  state: PlaylistState;
  dispatch: React.Dispatch<PlaylistAction>;
  nextTrack: () => void;
  previousTrack: () => void;
  seekToTrack: (index: number) => void;
} | null>(null);

const playlistReducer = (state: PlaylistState, action: PlaylistAction): PlaylistState => {
  switch (action.type) {
    case 'SET_PLAYLIST':
      return { ...state, currentPlaylist: action.payload };
    case 'SET_TRACK_INDEX':
      return { ...state, currentTrackIndex: action.payload };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'SET_REPEAT':
      return { ...state, repeat: action.payload };
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] };
    case 'REMOVE_FROM_QUEUE':
      return {
        ...state,
        queue: state.queue.filter((_, index) => index !== action.payload),
      };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 50),
      };
    default:
      return state;
  }
};

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { playAudio, stopAudio } = useHowl();
  const [state, dispatch] = useReducer(playlistReducer, {
    currentPlaylist: null,
    currentTrackIndex: 0,
    isPlaying: false,
    shuffle: false,
    repeat: 'none',
    queue: [],
    history: [],
  });

  const nextTrack = () => {
    if (!state.currentPlaylist) return;

    let nextIndex: number;
    if (state.shuffle) {
      nextIndex = Math.floor(Math.random() * state.currentPlaylist.mediaItems.length);
    } else {
      nextIndex = (state.currentTrackIndex + 1) % state.currentPlaylist.mediaItems.length;
    }

    if (nextIndex === 0 && state.repeat === 'none') {
      stopAudio();
      dispatch({ type: 'TOGGLE_PLAY' });
      return;
    }

    dispatch({ type: 'SET_TRACK_INDEX', payload: nextIndex });
  };

  const previousTrack = () => {
    if (!state.currentPlaylist) return;

    let prevIndex: number;
    if (state.shuffle) {
      prevIndex = Math.floor(Math.random() * state.currentPlaylist.mediaItems.length);
    } else {
      prevIndex = state.currentTrackIndex === 0 
        ? state.currentPlaylist.mediaItems.length - 1 
        : state.currentTrackIndex - 1;
    }

    dispatch({ type: 'SET_TRACK_INDEX', payload: prevIndex });
  };

  const seekToTrack = (index: number) => {
    if (!state.currentPlaylist || index >= state.currentPlaylist.mediaItems.length) return;
    dispatch({ type: 'SET_TRACK_INDEX', payload: index });
  };

  useEffect(() => {
    if (state.currentPlaylist && state.isPlaying) {
      const currentTrack = state.currentPlaylist.mediaItems[state.currentTrackIndex];
      playAudio(currentTrack.url);
      dispatch({ type: 'ADD_TO_HISTORY', payload: currentTrack });
    }
  }, [state.currentTrackIndex, state.currentPlaylist]);

  return (
    <PlaylistContext.Provider value={{ state, dispatch, nextTrack, previousTrack, seekToTrack }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

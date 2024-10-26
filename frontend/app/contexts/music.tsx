import { createContext, useContext, useState, useCallback } from 'react';
import type { Track } from '~/services/music.server';
import { Howl } from 'howler';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentSound: Howl | null;
  is3D: boolean;
  analyserData: Uint8Array;
  setCurrentTrack: (track: Track | null) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleView: () => void;
  getAnalyserData: () => Uint8Array;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentSound, setCurrentSound] = useState<Howl | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [analyserData, setAnalyserData] = useState<Uint8Array>(new Uint8Array());

  const togglePlay = useCallback(() => {
    if (currentSound) {
      if (isPlaying) {
        currentSound.pause();
      } else {
        currentSound.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [currentSound, isPlaying]);

  const nextTrack = useCallback(() => {
    // Implement next track logic
  }, []);

  const previousTrack = useCallback(() => {
    // Implement previous track logic
  }, []);

  const toggleView = useCallback(() => {
    setIs3D(prev => !prev);
  }, []);

  const getAnalyserData = useCallback(() => {
    return analyserData;
  }, [analyserData]);

  const value = {
    currentTrack,
    isPlaying,
    volume,
    currentSound,
    is3D,
    analyserData,
    setCurrentTrack,
    togglePlay,
    setVolume,
    nextTrack,
    previousTrack,
    toggleView,
    getAnalyserData,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

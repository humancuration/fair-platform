import { createContext, useContext, useState, useCallback } from 'react';
import type { Track, SoundEffect } from '~/services/audio.client';

interface AudioContextType {
  masterVolume: number;
  backgroundMusicVolume: number;
  soundEffectsVolume: number;
  isMuted: boolean;
  currentTrack: Track | null;
  setMasterVolume: (volume: number) => void;
  setBackgroundMusicVolume: (volume: number) => void;
  setSoundEffectsVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setCurrentTrack: (track: Track | null) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [masterVolume, setMasterVolume] = useState(1);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0.5);
  const [soundEffectsVolume, setSoundEffectsVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const value = {
    masterVolume,
    backgroundMusicVolume,
    soundEffectsVolume,
    isMuted,
    currentTrack,
    setMasterVolume,
    setBackgroundMusicVolume,
    setSoundEffectsVolume,
    setIsMuted,
    setCurrentTrack,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

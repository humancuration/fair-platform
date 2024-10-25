import React, { createContext, useContext, useState, useEffect } from 'react';
import { Howl } from 'howler';

interface AudioContextType {
  masterVolume: number;
  backgroundMusicVolume: number;
  soundEffectsVolume: number;
  isMuted: boolean;
  setMasterVolume: (volume: number) => void;
  setBackgroundMusicVolume: (volume: number) => void;
  setSoundEffectsVolume: (volume: number) => void;
  toggleMute: () => void;
  playSound: (soundId: string) => void;
  stopSound: (soundId: string) => void;
  pauseSound: (soundId: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0.5);
  const [soundEffectsVolume, setSoundEffectsVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [sounds] = useState<Map<string, Howl>>(new Map());

  useEffect(() => {
    // Load saved audio preferences
    const savedPreferences = localStorage.getItem('audioPreferences');
    if (savedPreferences) {
      const { master, bgm, sfx, muted } = JSON.parse(savedPreferences);
      setMasterVolume(master);
      setBackgroundMusicVolume(bgm);
      setSoundEffectsVolume(sfx);
      setIsMuted(muted);
    }
  }, []);

  useEffect(() => {
    // Save audio preferences
    localStorage.setItem('audioPreferences', JSON.stringify({
      master: masterVolume,
      bgm: backgroundMusicVolume,
      sfx: soundEffectsVolume,
      muted: isMuted
    }));

    // Update all sound volumes
    sounds.forEach(sound => {
      const isBGM = sound.isBGM || false;
      const baseVolume = isBGM ? backgroundMusicVolume : soundEffectsVolume;
      sound.volume(isMuted ? 0 : baseVolume * masterVolume);
    });
  }, [masterVolume, backgroundMusicVolume, soundEffectsVolume, isMuted, sounds]);

  const toggleMute = () => setIsMuted(!isMuted);

  const playSound = (soundId: string) => {
    const sound = sounds.get(soundId);
    if (sound) {
      sound.play();
    }
  };

  const stopSound = (soundId: string) => {
    const sound = sounds.get(soundId);
    if (sound) {
      sound.stop();
    }
  };

  const pauseSound = (soundId: string) => {
    const sound = sounds.get(soundId);
    if (sound) {
      sound.pause();
    }
  };

  return (
    <AudioContext.Provider
      value={{
        masterVolume,
        backgroundMusicVolume,
        soundEffectsVolume,
        isMuted,
        setMasterVolume,
        setBackgroundMusicVolume,
        setSoundEffectsVolume,
        toggleMute,
        playSound,
        stopSound,
        pauseSound
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

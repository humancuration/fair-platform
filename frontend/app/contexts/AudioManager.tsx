import React, { useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { useAudio } from '~/contexts/audio';

interface Sound {
  id: string;
  url: string;
  volume?: number;
  loop?: boolean;
  sprite?: Record<string, [number, number]>;
}

interface AudioManagerProps {
  sounds: Sound[];
  onLoad?: () => void;
  onError?: (error: any) => void;
}

export class AudioCache {
  private static instance: AudioCache;
  private cache: Map<string, Howl> = new Map();

  static getInstance(): AudioCache {
    if (!AudioCache.instance) {
      AudioCache.instance = new AudioCache();
    }
    return AudioCache.instance;
  }

  get(id: string): Howl | undefined {
    return this.cache.get(id);
  }

  set(id: string, howl: Howl): void {
    this.cache.set(id, howl);
  }

  remove(id: string): void {
    const howl = this.cache.get(id);
    if (howl) {
      howl.unload();
      this.cache.delete(id);
    }
  }

  clear(): void {
    this.cache.forEach(howl => howl.unload());
    this.cache.clear();
  }

  forEach(callback: (sound: Howl, id: string) => void): void {
    this.cache.forEach(callback);
  }
}

export const useAudioPlayer = () => {
  const { 
    masterVolume, 
    isMuted, 
    backgroundMusicVolume, 
    soundEffectsVolume 
  } = useAudio();
  
  const audioCache = AudioCache.getInstance();

  const play = useCallback((id: string, sprite?: string) => {
    const sound = audioCache.get(id);
    if (sound) {
      const isBGM = id.startsWith('bgm_');
      const baseVolume = isBGM ? backgroundMusicVolume : soundEffectsVolume;
      const finalVolume = isMuted ? 0 : baseVolume * masterVolume;
      sound.volume(finalVolume);
      
      if (sprite) {
        return sound.play(sprite);
      }
      return sound.play();
    }
    return null;
  }, [masterVolume, isMuted, backgroundMusicVolume, soundEffectsVolume]);

  const stop = useCallback((id: string) => {
    const sound = audioCache.get(id);
    if (sound) {
      sound.stop();
    }
  }, []);

  const pause = useCallback((id: string) => {
    const sound = audioCache.get(id);
    if (sound) {
      sound.pause();
    }
  }, []);

  const setVolume = useCallback((id: string, volume: number) => {
    const sound = audioCache.get(id);
    if (sound) {
      sound.volume(Math.max(0, Math.min(1, volume)));
    }
  }, []);

  return { play, stop, pause, setVolume };
};

const AudioManager: React.FC<AudioManagerProps> = ({ 
  sounds, 
  onLoad, 
  onError 
}) => {
  useEffect(() => {
    const audioCache = AudioCache.getInstance();
    let loadedCount = 0;

    sounds.forEach(sound => {
      if (!audioCache.get(sound.id)) {
        const howl = new Howl({
          src: [sound.url],
          volume: sound.volume ?? 1,
          loop: sound.loop ?? false,
          sprite: sound.sprite,
          onload: () => {
            loadedCount++;
            if (loadedCount === sounds.length) {
              onLoad?.();
            }
          },
          onloaderror: (id, error) => {
            onError?.(error);
          }
        });
        audioCache.set(sound.id, howl);
      }
    });

    return () => {
      sounds.forEach(sound => {
        audioCache.remove(sound.id);
      });
    };
  }, [sounds, onLoad, onError]);

  return null;
};

export default AudioManager;

import { useCallback } from 'react';
import { Howl } from 'howler';
import { useAudio } from '~/contexts/audio';

class AudioCache {
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
}

export function useAudioPlayer() {
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
      
      return sprite ? sound.play(sprite) : sound.play();
    }
    return null;
  }, [masterVolume, isMuted, backgroundMusicVolume, soundEffectsVolume]);

  const stop = useCallback((id: string) => {
    audioCache.get(id)?.stop();
  }, []);

  const pause = useCallback((id: string) => {
    audioCache.get(id)?.pause();
  }, []);

  const setVolume = useCallback((id: string, volume: number) => {
    const sound = audioCache.get(id);
    if (sound) {
      sound.volume(Math.max(0, Math.min(1, volume)));
    }
  }, []);

  return { play, stop, pause, setVolume };
}

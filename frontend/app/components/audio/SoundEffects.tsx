import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useAudio } from '~/contexts/audio';
import type { SoundEffect } from '~/services/audio.server';

interface SoundEffectsProps {
  effects: SoundEffect[];
  maxConcurrent?: number;
}

export default function SoundEffects({
  effects,
  maxConcurrent = 10
}: SoundEffectsProps) {
  const soundsRef = useRef<Map<string, Howl>>(new Map());
  const activeSourcesRef = useRef<Set<string>>(new Set());
  
  const { 
    masterVolume, 
    soundEffectsVolume, 
    isMuted 
  } = useAudio();

  useEffect(() => {
    effects.forEach(effect => {
      if (!soundsRef.current.has(effect.id)) {
        const sound = new Howl({
          src: [effect.url],
          sprite: effect.sprite,
          volume: isMuted ? 0 : (effect.volume || 1) * soundEffectsVolume * masterVolume,
          spatial: effect.spatial || false,
          onend: (soundId) => {
            activeSourcesRef.current.delete(soundId);
          }
        });

        if (effect.spatial && effect.position) {
          sound.pos(...effect.position);
        }

        soundsRef.current.set(effect.id, sound);
      }
    });

    return () => {
      soundsRef.current.forEach(sound => sound.unload());
      soundsRef.current.clear();
      activeSourcesRef.current.clear();
    };
  }, [effects]);

  useEffect(() => {
    soundsRef.current.forEach((sound, id) => {
      const effect = effects.find(e => e.id === id);
      if (effect) {
        sound.volume(isMuted ? 0 : (effect.volume || 1) * soundEffectsVolume * masterVolume);
      }
    });
  }, [masterVolume, soundEffectsVolume, isMuted]);

  return null;
}

import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useAudio } from '../../contexts/AudioContext';

interface SoundEffect {
  id: string;
  url: string;
  category: 'ui' | 'ambient' | 'action' | 'notification';
  volume?: number;
  sprite?: Record<string, [number, number]>;
  spatial?: boolean;
  position?: [number, number, number];
}

interface SoundEffectsProps {
  effects: SoundEffect[];
  maxConcurrent?: number;
}

const SoundEffects: React.FC<SoundEffectsProps> = ({
  effects,
  maxConcurrent = 10
}) => {
  const soundsRef = useRef<Map<string, Howl>>(new Map());
  const activeSourcesRef = useRef<Set<string>>(new Set());
  
  const { 
    masterVolume, 
    soundEffectsVolume, 
    isMuted 
  } = useAudio();

  useEffect(() => {
    // Initialize sound effects
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

    // Cleanup function
    return () => {
      soundsRef.current.forEach(sound => {
        sound.unload();
      });
      soundsRef.current.clear();
      activeSourcesRef.current.clear();
    };
  }, [effects]);

  // Update volumes when audio context changes
  useEffect(() => {
    soundsRef.current.forEach((sound, id) => {
      const effect = effects.find(e => e.id === id);
      if (effect) {
        sound.volume(isMuted ? 0 : (effect.volume || 1) * soundEffectsVolume * masterVolume);
      }
    });
  }, [masterVolume, soundEffectsVolume, isMuted]);

  const playSound = (effectId: string, sprite?: string) => {
    const sound = soundsRef.current.get(effectId);
    if (sound && activeSourcesRef.current.size < maxConcurrent) {
      const soundId = sprite ? sound.play(sprite) : sound.play();
      activeSourcesRef.current.add(String(soundId));
      return soundId;
    }
    return null;
  };

  const stopSound = (effectId: string) => {
    const sound = soundsRef.current.get(effectId);
    if (sound) {
      sound.stop();
    }
  };

  const pauseSound = (effectId: string) => {
    const sound = soundsRef.current.get(effectId);
    if (sound) {
      sound.pause();
    }
  };

  const updatePosition = (effectId: string, position: [number, number, number]) => {
    const sound = soundsRef.current.get(effectId);
    if (sound) {
      sound.pos(...position);
    }
  };

  return null; // This component doesn't render anything
};

export default SoundEffects;

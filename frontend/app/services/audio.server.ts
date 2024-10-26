import { prisma } from '~/utils/db.server';

export interface Track {
  id: string;
  url: string;
  title: string;
  mood: 'calm' | 'intense' | 'mysterious' | 'upbeat';
  loop: boolean;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
}

export interface SoundEffect {
  id: string;
  url: string;
  category: 'ui' | 'ambient' | 'action' | 'notification';
  volume?: number;
  sprite?: Record<string, [number, number]>;
  spatial?: boolean;
  position?: [number, number, number];
}

export async function getBackgroundTracks() {
  return prisma.backgroundTrack.findMany({
    select: {
      id: true,
      url: true,
      title: true,
      mood: true,
      loop: true,
      volume: true,
      fadeIn: true,
      fadeOut: true,
    },
  });
}

export async function getSoundEffects() {
  return prisma.soundEffect.findMany({
    select: {
      id: true,
      url: true,
      category: true,
      volume: true,
      sprite: true,
      spatial: true,
      position: true,
    },
  });
}

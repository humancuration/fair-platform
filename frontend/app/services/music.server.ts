import { prisma } from '~/utils/db.server';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverArt: string;
  duration: number;
  visualizerType: 'bars' | 'circles' | 'waves';
  genre: string;
  bpm: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

export async function getTracks() {
  return prisma.track.findMany({
    select: {
      id: true,
      title: true,
      artist: true,
      url: true,
      coverArt: true,
      duration: true,
      visualizerType: true,
      genre: true,
      bpm: true,
    },
  });
}

export async function getPlaylist(id: string) {
  return prisma.playlist.findUnique({
    where: { id },
    include: {
      tracks: true,
    },
  });
}

export async function getLyrics(trackId: string) {
  return prisma.lyrics.findMany({
    where: { trackId },
    orderBy: { time: 'asc' },
    select: {
      time: true,
      text: true,
    },
  });
}

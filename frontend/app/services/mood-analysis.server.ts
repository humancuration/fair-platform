import { prisma } from '~/utils/db.server';

export interface MoodAnalysis {
  id: string;
  mediaItemId: string;
  energy: number;
  danceability: number;
  valence: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  createdAt: Date;
}

export async function analyzeMood(mediaItemId: string) {
  // In a real implementation, this would connect to an audio analysis service
  // For now, we'll return mock data
  const analysis = {
    mediaItemId,
    energy: Math.random(),
    danceability: Math.random(),
    valence: Math.random(),
    tempo: 60 + Math.random() * 120,
    acousticness: Math.random(),
    instrumentalness: Math.random(),
  };

  return prisma.moodAnalysis.create({
    data: analysis,
  });
}

export async function getPlaylistMoodAnalysis(playlistId: string) {
  const analyses = await prisma.moodAnalysis.findMany({
    where: {
      mediaItem: {
        playlistId,
      },
    },
  });

  if (!analyses.length) {
    return null;
  }

  // Calculate average mood metrics
  return {
    energy: average(analyses.map(a => a.energy)),
    danceability: average(analyses.map(a => a.danceability)),
    valence: average(analyses.map(a => a.valence)),
    tempo: average(analyses.map(a => a.tempo)),
    acousticness: average(analyses.map(a => a.acousticness)),
    instrumentalness: average(analyses.map(a => a.instrumentalness)),
  };
}

function average(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

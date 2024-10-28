import { prisma } from "~/db.server";
import type { Playlist, Track, Contributor } from "~/types/playlist";

export async function getPlaylistData(playlistId: string) {
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
    include: {
      tracks: true,
      currentTrack: true,
      settings: true,
    },
  });

  if (!playlist) throw new Error("Playlist not found");

  return {
    id: playlist.id,
    tracks: playlist.tracks,
    currentTrackId: playlist.currentTrackId,
    isPlaying: playlist.settings.isPlaying,
    shuffleEnabled: playlist.settings.shuffleEnabled,
    repeatEnabled: playlist.settings.repeatEnabled,
  };
}

export async function getPlaylistCardData(playlistId: string) {
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
    include: {
      contributors: true,
      stats: true,
    },
  });

  if (!playlist) throw new Error("Playlist not found");

  return {
    playlist,
    contributors: playlist.contributors,
    stats: {
      likes: playlist.stats.likes,
      shares: playlist.stats.shares,
      activeCollaborators: playlist.contributors.filter(c => c.isActive).length,
    },
  };
}

export async function togglePlayState(playlistId: string) {
  return prisma.playlistSettings.update({
    where: { playlistId },
    data: {
      isPlaying: {
        set: (settings) => !settings.isPlaying,
      },
    },
  });
}

// Add other playlist control functions...

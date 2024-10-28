import { prisma } from "~/db.server";
import type { Playlist, Track, Contributor } from "~/types/playlist";
import { db } from "~/utils/db.server";

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

export async function getPlaylistStats(playlistId: string) {
  return db.playlist.findUnique({
    where: { id: playlistId },
    select: {
      playCount: true,
      totalDuration: true,
      uniqueListeners: true,
      shareCount: true,
      listenerHistory: {
        orderBy: { date: 'asc' },
        select: {
          date: true,
          count: true,
        },
      },
    },
  });
}

export async function getCollaborators(playlistId: string) {
  return db.playlistCollaborator.findMany({
    where: { playlistId },
    include: {
      user: true,
    },
  });
}

export async function getActivityHistory(playlistId: string) {
  return db.playlistActivity.findMany({
    where: { playlistId },
    orderBy: { timestamp: 'desc' },
    include: {
      user: true,
      track: true,
    },
  });
}

export async function removeCollaborator(playlistId: string, userId: string) {
  return db.playlistCollaborator.delete({
    where: {
      playlistId_userId: {
        playlistId,
        userId,
      },
    },
  });
}

export async function togglePlaylistAccess(playlistId: string) {
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
  });

  return db.playlist.update({
    where: { id: playlistId },
    data: {
      isPublic: !playlist?.isPublic,
    },
  });
}

// Add other playlist control functions...

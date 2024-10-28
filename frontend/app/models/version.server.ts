import { prisma } from "~/db.server";
import type { PlaylistVersion, PlaylistFork } from "~/types/version";

export async function getVersionHistory(playlistId: string) {
  return prisma.playlistVersion.findMany({
    where: { playlistId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          type: true,
          avatar: true,
        },
      },
      changes: true,
      metadata: true,
    },
  });
}

export async function getForks(playlistId: string) {
  return prisma.playlistFork.findMany({
    where: { originalPlaylistId: playlistId },
    include: {
      forkedFrom: {
        include: {
          owner: true,
        },
      },
      stats: true,
    },
  });
}

export async function createFork(playlistId: string, data: any) {
  return prisma.playlistFork.create({
    data: {
      ...data,
      originalPlaylistId: playlistId,
    },
  });
}

export async function mergeFork(playlistId: string, forkId: string) {
  // Implementation for merging fork changes
  const fork = await prisma.playlistFork.findUnique({
    where: { id: forkId },
    include: { changes: true },
  });

  // Apply changes from fork to original playlist
  // Create new version with merged changes
  // Return updated playlist
}

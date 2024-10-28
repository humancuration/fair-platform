import { db } from "~/utils/db.server";
import type { Curator, CuratorStats, CuratorFilter, SortBy } from "~/types/curator";

export async function getCurators(filter: CuratorFilter, sortBy: SortBy) {
  // Implementation for fetching curators with filters and sorting
  return db.curator.findMany({
    where: buildFilterQuery(filter),
    orderBy: buildSortQuery(sortBy),
    include: {
      stats: true,
      badges: true,
      aiFeatures: filter === 'ai',
    },
  });
}

export async function getCuratorStats(curatorId: string): Promise<CuratorStats> {
  return db.curatorStats.findUnique({
    where: { curatorId },
    include: {
      genreExpertise: true,
      specializations: true,
    },
  });
}

export async function updateCuratorMonetization(curatorId: string, data: any) {
  return db.curator.update({
    where: { id: curatorId },
    data: {
      monetization: data,
    },
  });
}

// Helper functions for building queries
function buildFilterQuery(filter: CuratorFilter) {
  switch (filter) {
    case 'ai':
      return { type: 'ai' };
    case 'human':
      return { type: 'human' };
    case 'hybrid':
      return { type: 'hybrid' };
    case 'trending':
      return { 
        stats: {
          monthlyListeners: { gt: 1000 }
        }
      };
    default:
      return {};
  }
}

function buildSortQuery(sortBy: SortBy) {
  switch (sortBy) {
    case 'rating':
      return { stats: { averageRating: 'desc' } };
    case 'followers':
      return { stats: { followers: 'desc' } };
    case 'innovative':
      return { stats: { innovationScore: 'desc' } };
    default:
      return { stats: { curatorScore: 'desc' } };
  }
}

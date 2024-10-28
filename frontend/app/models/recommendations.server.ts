import { prisma } from "~/db.server";
import type { Track } from "~/types/playlist";

export async function getPlaylistRecommendations(playlistId: string) {
  const recommendations = await prisma.recommendation.findMany({
    where: { playlistId },
    include: {
      track: true,
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return recommendations.map(rec => ({
    ...rec,
    confidence: calculateConfidence(rec),
    reason: generateRecommendationReason(rec),
  }));
}

function calculateConfidence(recommendation: any) {
  // Complex confidence calculation algorithm
  return Math.round(recommendation.score * 100);
}

function generateRecommendationReason(recommendation: any) {
  // Generate human-readable reason for recommendation
  return `Based on ${recommendation.matchingFeatures.join(", ")}`;
}

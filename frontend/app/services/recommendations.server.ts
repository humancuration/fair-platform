import { prisma } from '~/utils/db.server';
import type { Product } from '~/types';

interface RecommendationOptions {
  limit?: number;
  userId?: string;
  category?: string;
}

export async function getRecommendations(options: RecommendationOptions = {}) {
  const { limit = 10, userId, category } = options;

  const where = {
    ...(category && { category }),
    inStock: true,
  };

  const products = await prisma.product.findMany({
    where,
    take: limit,
    orderBy: {
      ...(userId ? { userInteractions: { _count: 'desc' } } : { createdAt: 'desc' }),
    },
    include: {
      vendor: {
        select: {
          name: true,
          sustainabilityRating: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  return products;
}

export async function getPersonalizedRecommendations(userId: string, limit = 10) {
  // Implement personalized recommendation logic here
  // This could involve user preferences, purchase history, etc.
  return getRecommendations({ limit, userId });
}

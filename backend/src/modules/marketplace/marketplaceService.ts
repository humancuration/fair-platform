import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { Client } from '@opensearch-project/opensearch';
import { logger } from '../../utils/logger';
import { Product, Company } from './types';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);
const searchClient = new Client({ node: process.env.OPENSEARCH_URL });

export class MarketplaceService {
  private static CACHE_TTL = 3600; // 1 hour

  static async getProducts(): Promise<Product[]> {
    try {
      // Check cache first
      const cachedProducts = await redis.get('products:all');
      if (cachedProducts) {
        return JSON.parse(cachedProducts);
      }

      const products = await prisma.product.findMany({
        include: { seller: true }
      });

      // Set cache
      await redis.setex('products:all', this.CACHE_TTL, JSON.stringify(products));
      return products;
    } catch (error) {
      logger.error('Error fetching products:', error);
      throw error;
    }
  }

  static async searchProducts(params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    try {
      const { query, category, minPrice, maxPrice } = params;

      const searchBody = {
        query: {
          bool: {
            must: [
              query ? {
                multi_match: {
                  query,
                  fields: ['name', 'description']
                }
              } : { match_all: {} },
              category ? { term: { category } } : undefined,
              minPrice || maxPrice ? {
                range: {
                  price: {
                    gte: minPrice,
                    lte: maxPrice
                  }
                }
              } : undefined
            ].filter(Boolean)
          }
        }
      };

      const result = await searchClient.search({
        index: 'products',
        body: searchBody
      });

      return result.body.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
      logger.error('Error searching products:', error);
      throw error;
    }
  }

  static async getRecommendations(userId: string): Promise<Product[]> {
    try {
      const cacheKey = `recommendations:${userId}`;
      const cachedRecommendations = await redis.get(cacheKey);
      
      if (cachedRecommendations) {
        return JSON.parse(cachedRecommendations);
      }

      // Get user's purchase history and preferences
      const userHistory = await prisma.purchase.findMany({
        where: { userId },
        include: { product: true }
      });

      // Implement recommendation logic (simplified version)
      const recommendations = await prisma.product.findMany({
        where: {
          category: {
            in: userHistory.map(h => h.product.category)
          }
        },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });

      await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(recommendations));
      return recommendations;
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      throw error;
    }
  }
}

import { GraphQLError } from 'graphql';
import { MarketplaceService } from './marketplaceService';
import { ProductSchema, CompanySchema } from './types';

export const marketplaceResolvers = {
  Query: {
    products: async (_: any, __: any, context: any) => {
      try {
        const products = await MarketplaceService.getProducts();
        return products.map(p => ProductSchema.parse(p));
      } catch (error) {
        throw new GraphQLError('Failed to fetch products', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    searchProducts: async (_: any, args: any, context: any) => {
      try {
        const products = await MarketplaceService.searchProducts(args);
        return products.map(p => ProductSchema.parse(p));
      } catch (error) {
        throw new GraphQLError('Failed to search products', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },

    recommendations: async (_: any, __: any, context: any) => {
      try {
        const { userId } = context;
        const recommendations = await MarketplaceService.getRecommendations(userId);
        return recommendations.map(p => ProductSchema.parse(p));
      } catch (error) {
        throw new GraphQLError('Failed to fetch recommendations', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }
};

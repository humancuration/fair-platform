import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { IContext } from '../../types/context';

const prisma = new PrismaClient();

export const communityWishlistResolvers = {
  Query: {
    getCommunityWishlist: async () => {
      return prisma.communityWishlist.findMany({
        orderBy: [
          { highlighted: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 50,
        include: {
          user: {
            select: {
              username: true,
              avatar: true
            }
          }
        }
      });
    },

    searchCommunityWishlist: async (_: any, { query }: { query: string }) => {
      return prisma.communityWishlist.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { communityName: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          user: {
            select: {
              username: true,
              avatar: true
            }
          }
        },
        take: 20
      });
    }
  },

  Mutation: {
    highlightCommunityItem: async (_: any, { productId }: { productId: string }, context: IContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      try {
        // First, remove highlighting from all items
        await prisma.communityWishlist.updateMany({
          data: {
            highlighted: false
          }
        });

        // Then highlight the selected item
        const updatedItem = await prisma.communityWishlist.update({
          where: {
            id: parseInt(productId)
          },
          data: {
            highlighted: true
          },
          include: {
            user: {
              select: {
                username: true,
                avatar: true
              }
            }
          }
        });

        return updatedItem;
      } catch (error) {
        throw new GraphQLError('Failed to highlight community wishlist item', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    addToCommunityWishlist: async (
      _: any,
      { input }: { input: {
        productId: string;
        name: string;
        image: string;
        price: number;
        communityName: string;
      }},
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      try {
        const newItem = await prisma.communityWishlist.create({
          data: {
            userId: context.user.id,
            productId: input.productId,
            name: input.name,
            image: input.image,
            price: input.price,
            communityName: input.communityName,
          },
          include: {
            user: {
              select: {
                username: true,
                avatar: true
              }
            }
          }
        });

        return newItem;
      } catch (error) {
        console.error('Error adding to community wishlist:', error);
        throw new Error('Failed to add item to community wishlist');
      }
    },

    contributeToCommunityItem: async (
      _: any,
      { itemId, contribution }: { itemId: number; contribution: number },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const item = await prisma.communityWishlistItem.findUnique({
        where: { id: itemId }
      });

      if (!item) {
        throw new UserInputError('Community wishlist item not found');
      }

      return prisma.communityWishlistItem.update({
        where: { id: itemId },
        data: {
          contributors: {
            push: context.user.id
          },
          totalContributions: {
            increment: contribution
          }
        },
        include: {
          user: {
            select: {
              username: true,
              avatar: true
            }
          }
        }
      });
    }
  }
};

// Add these type definitions to your GraphQL schema
export const communityWishlistTypeDefs = `
  extend type Query {
    getCommunityWishlist: [CommunityWishlist!]!
    searchCommunityWishlist(query: String!): [CommunityWishlist!]!
  }

  extend type Mutation {
    highlightCommunityItem(productId: ID!): CommunityWishlist!
    addToCommunityWishlist(input: AddToCommunityWishlistInput!): CommunityWishlist!
    contributeToCommunityItem(itemId: Int!, contribution: Float!): CommunityWishlistItem!
  }

  input AddToCommunityWishlistInput {
    productId: String!
    name: String!
    image: String!
    price: Float!
    communityName: String!
  }
`;

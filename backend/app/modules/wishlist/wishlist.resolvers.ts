import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { IContext } from '../../types/context';
import type { Resolvers } from '../../types/graphql';

const prisma = new PrismaClient();

export const resolvers: Resolvers = {
  Query: {
    wishlist: async (_, { name }, { user, prisma }) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const wishlist = await prisma.wishlist.findFirst({
        where: {
          AND: [
            { userId: user.id },
            { name }
          ]
        },
        include: {
          items: true,
        },
      });

      if (!wishlist) {
        throw new GraphQLError('Wishlist not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return wishlist;
    },

    publicWishlist: async (_, { username }, { prisma }) => {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const wishlist = await prisma.wishlist.findFirst({
        where: {
          userId: user.id,
          isPublic: true,
        },
        include: {
          items: true,
        },
      });

      if (!wishlist) {
        throw new GraphQLError('Public wishlist not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return wishlist;
    },

    communityWishlist: async (_, __, { prisma }) => {
      return prisma.communityWishlist.findMany({
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: [
          { highlighted: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 50,
      });
    },
  },

  Mutation: {
    upsertWishlist: async (_, { input }, { user, prisma }) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { name, description, isPublic, items } = input;

      const wishlist = await prisma.wishlist.upsert({
        where: {
          userId_name: {
            userId: user.id,
            name,
          },
        },
        update: {
          description,
          isPublic,
        },
        create: {
          name,
          description,
          isPublic,
          userId: user.id,
        },
        include: {
          items: true,
        },
      });

      if (items?.length) {
        await prisma.wishlistItem.createMany({
          data: items.map((item: any) => ({
            ...item,
            wishlistId: wishlist.id,
          })),
          skipDuplicates: true,
        });
      }

      return wishlist;
    },

    addCommunityWishlistItem: async (_, { input }, { user, prisma }) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return prisma.communityWishlist.create({
        data: {
          ...input,
          userId: user.id,
        },
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });
    },

    highlightCommunityItem: async (_, { productId }, { user, prisma }) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      await prisma.communityWishlist.updateMany({
        data: { highlighted: false },
      });

      return prisma.communityWishlist.update({
        where: { id: productId },
        data: { highlighted: true },
      });
    },

    contributeToCommunityItem: async (_, { itemId, amount }, { user, prisma }) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const item = await prisma.communityWishlist.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new GraphQLError('Community wishlist item not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return prisma.communityWishlist.update({
        where: { id: itemId },
        data: {
          contributors: {
            push: user.id,
          },
          totalContributions: {
            increment: amount,
          },
        },
      });
    },
  },
};

import { prisma } from '../db.server';
import type { User } from '@prisma/client';

export async function getWishlistByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      wishlist: {
        include: {
          items: true
        }
      }
    }
  });

  if (!user || !user.wishlist?.isPublic) {
    return null;
  }

  return user.wishlist;
}

export async function getUserWishlist(userId: User['id']) {
  return prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: true
    }
  });
}

export async function addWishlistItem(userId: User['id'], data: {
  name: string;
  description: string;
  image?: string;
}) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId }
  });

  if (!wishlist) {
    return prisma.wishlist.create({
      data: {
        userId,
        items: {
          create: data
        }
      },
      include: {
        items: true
      }
    });
  }

  return prisma.wishlist.update({
    where: { id: wishlist.id },
    data: {
      items: {
        create: data
      }
    },
    include: {
      items: true
    }
  });
}

export async function removeWishlistItem(userId: User['id'], itemId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: true }
  });

  if (!wishlist) {
    throw new Error('Wishlist not found');
  }

  const item = wishlist.items.find(item => item.id === itemId);
  if (!item) {
    throw new Error('Item not found');
  }

  await prisma.wishlistItem.delete({
    where: { id: itemId }
  });

  return wishlist;
}

export async function toggleWishlistVisibility(userId: User['id']) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId }
  });

  if (!wishlist) {
    throw new Error('Wishlist not found');
  }

  return prisma.wishlist.update({
    where: { id: wishlist.id },
    data: {
      isPublic: !wishlist.isPublic
    }
  });
}

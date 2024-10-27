import { prisma } from "~/utils/db.server";
import type { User } from "@prisma/client";

export async function getWishlistByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      wishlists: {
        include: {
          items: true
        }
      }
    }
  });

  if (!user || !user.wishlists?.[0]?.isPublic) {
    return null;
  }

  return user.wishlists[0];
}

export async function getUserWishlist(userId: User["id"]) {
  const wishlist = await prisma.wishlist.findFirst({
    where: { userId },
    include: {
      items: true
    }
  });

  return wishlist;
}

export async function addWishlistItem(userId: User["id"], data: {
  name: string;
  description: string;
  image?: string;
}) {
  const wishlist = await getUserWishlist(userId);

  if (!wishlist) {
    return prisma.wishlist.create({
      data: {
        name: `${userId}'s Wishlist`,
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

export async function removeWishlistItem(userId: User["id"], itemId: string) {
  const wishlist = await getUserWishlist(userId);

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  await prisma.wishlistItem.delete({
    where: { id: itemId }
  });

  return getUserWishlist(userId);
}

export async function toggleWishlistVisibility(userId: User["id"]) {
  const wishlist = await getUserWishlist(userId);

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  return prisma.wishlist.update({
    where: { id: wishlist.id },
    data: {
      isPublic: !wishlist.isPublic
    }
  });
}

import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

// Validation schemas
const wishlistItemSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  imageUrl: z.string().url().optional(),
  targetAmount: z.number().min(0).optional(),
  isPublic: z.boolean().default(false),
});

export const upsertWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const validatedData = wishlistItemSchema.parse(req.body);

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    return res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Error creating wishlist item:', error);
    return res.status(400).json({ error: 'Invalid request data' });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    const wishlist = await prisma.wishlistItem.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getPublicWishlistByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const wishlist = await prisma.wishlistItem.findMany({
      where: {
        user: {
          username,
        },
        isPublic: true,
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    return res.json(wishlist);
  } catch (error) {
    console.error('Error fetching public wishlist:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}; 
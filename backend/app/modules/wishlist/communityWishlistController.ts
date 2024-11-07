import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const communityItemSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.string(),
  imageUrl: z.string().url().optional(),
  targetAmount: z.number().min(0),
  timeline: z.number().min(1).optional(),
  allowContributions: z.boolean().default(true),
});

export const addToCommunityWishlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const validatedData = communityItemSchema.parse(req.body);

    const communityItem = await prisma.communityWishlistItem.create({
      data: {
        ...validatedData,
        createdById: userId,
      },
    });

    return res.status(201).json(communityItem);
  } catch (error) {
    console.error('Error creating community item:', error);
    return res.status(400).json({ error: 'Invalid request data' });
  }
};

export const getCommunityWishlist = async (req: Request, res: Response) => {
  try {
    const items = await prisma.communityWishlistItem.findMany({
      include: {
        createdBy: {
          select: {
            username: true,
            name: true,
          },
        },
        highlights: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(items);
  } catch (error) {
    console.error('Error fetching community wishlist:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const highlightItem = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { itemId } = req.body;

    const highlight = await prisma.communityItemHighlight.create({
      data: {
        itemId,
        userId,
      },
    });

    return res.json(highlight);
  } catch (error) {
    console.error('Error highlighting item:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const searchCommunityWishlist = async (req: Request, res: Response) => {
  try {
    const { q, category } = req.query;

    const items = await prisma.communityWishlistItem.findMany({
      where: {
        AND: [
          q ? {
            OR: [
              { name: { contains: String(q), mode: 'insensitive' } },
              { description: { contains: String(q), mode: 'insensitive' } },
            ],
          } : {},
          category ? { category: String(category) } : {},
        ],
      },
      include: {
        createdBy: {
          select: {
            username: true,
            name: true,
          },
        },
        highlights: true,
      },
    });

    return res.json(items);
  } catch (error) {
    console.error('Error searching community wishlist:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}; 
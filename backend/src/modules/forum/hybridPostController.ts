import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../utils/errors';
import { createLogger } from '../../utils/logger';

const prisma = new PrismaClient();
const logger = createLogger('HybridPostController');

interface CreateHybridPostDTO {
  content: string;
  isThread: boolean;
  parentId?: number;
  mentions?: string[];
  hashtags?: string[];
  attachments?: string[];
  visibility?: 'public' | 'unlisted' | 'private' | 'direct';
  sensitive?: boolean;
  spoilerText?: string;
}

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      prisma.hybridPost.findMany({
        where: { parentId: null },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          replies: {
            take: 3,
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.hybridPost.count({
        where: { parentId: null },
      }),
    ]);

    res.status(200).json({
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    logger.error('Error fetching feed:', error);
    next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const postData = req.body as CreateHybridPostDTO;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const post = await prisma.hybridPost.create({
      data: {
        ...postData,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    logger.info(`Hybrid post created: ${post.id}`);
    res.status(201).json({
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    logger.error('Error creating post:', error);
    next(error);
  }
};

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const post = await prisma.hybridPost.update({
      where: { id: Number(id) },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });

    logger.info(`Post liked: ${id}`);
    res.status(200).json({
      message: 'Post liked successfully',
      data: post,
    });
  } catch (error) {
    logger.error('Error liking post:', error);
    next(error);
  }
};

export const repostPost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const originalPost = await prisma.hybridPost.findUnique({
      where: { id: Number(id) },
    });

    if (!originalPost) {
      return next(new AppError('Post not found', 404));
    }

    const [repost] = await prisma.$transaction([
      prisma.hybridPost.create({
        data: {
          content: originalPost.content,
          isThread: false,
          parentId: originalPost.id,
          mentions: originalPost.mentions,
          hashtags: originalPost.hashtags,
          attachments: originalPost.attachments,
          visibility: originalPost.visibility,
          sensitive: originalPost.sensitive,
          spoilerText: originalPost.spoilerText,
          user: {
            connect: { id: userId },
          },
        },
      }),
      prisma.hybridPost.update({
        where: { id: Number(id) },
        data: {
          repostsCount: {
            increment: 1,
          },
        },
      }),
    ]);

    logger.info(`Post reposted: ${id}`);
    res.status(201).json({
      message: 'Post reposted successfully',
      data: repost,
    });
  } catch (error) {
    logger.error('Error reposting:', error);
    next(error);
  }
};

// backend/src/routes/posts.ts
import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../../middleware/auth';
import { AppError } from '../../utils/errors';
import { createLogger } from '../../utils/logger';

const prisma = new PrismaClient();
const logger = createLogger('PostsController');
const router = Router();

interface CreatePostDTO {
  title: string;
  content: string;
}

// Get all posts in a forum
router.get('/forum/:forumId', async (req: Request, res: Response, next: NextFunction) => {
  const { forumId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { forumId: Number(forumId) },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.post.count({
        where: { forumId: Number(forumId) },
      }),
    ]);

    res.status(200).json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching posts:', error);
    next(error);
  }
});

// Create a new post in a forum
router.post('/forum/:forumId', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  const { forumId } = req.params;
  const { title, content } = req.body as CreatePostDTO;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const forum = await prisma.forum.findUnique({
      where: { id: Number(forumId) },
    });

    if (!forum) {
      return next(new AppError('Forum not found', 404));
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        forum: {
          connect: { id: Number(forumId) },
        },
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

    logger.info(`Post created: ${post.id}`);
    res.status(201).json({
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    logger.error('Error creating post:', error);
    next(error);
  }
});

// Get a specific post with its details
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        forum: true,
      },
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    res.status(200).json({
      data: post,
    });
  } catch (error) {
    logger.error('Error fetching post:', error);
    next(error);
  }
});

// Update a post
router.patch('/:id', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: { userId: true },
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.userId !== userId) {
      return next(new AppError('Unauthorized - Not post owner', 403));
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    logger.info(`Post updated: ${id}`);
    res.status(200).json({
      message: 'Post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    logger.error('Error updating post:', error);
    next(error);
  }
});

// Delete a post
router.delete('/:id', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: { userId: true },
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.userId !== userId) {
      return next(new AppError('Unauthorized - Not post owner', 403));
    }

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    logger.info(`Post deleted: ${id}`);
    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting post:', error);
    next(error);
  }
});

export default router;

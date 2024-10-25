// backend/src/routes/forums.ts
import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../../middleware/auth';
import { AppError } from '../../utils/errors';
import { createLogger } from '../../utils/logger';

const prisma = new PrismaClient();
const logger = createLogger('ForumsController');
const router = Router();

interface CreateForumDTO {
  title: string;
  description: string;
}

// Get all forums
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const forums = await prisma.forum.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      data: forums,
    });
  } catch (error) {
    logger.error('Error fetching forums:', error);
    next(error);
  }
});

// Create a new forum (admin only)
router.post('/', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body as CreateForumDTO;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    // Verify admin status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return next(new AppError('Unauthorized - Admin access required', 403));
    }

    const forum = await prisma.forum.create({
      data: {
        title,
        description,
      },
    });

    logger.info(`Forum created: ${forum.id}`);
    res.status(201).json({
      message: 'Forum created successfully',
      data: forum,
    });
  } catch (error) {
    logger.error('Error creating forum:', error);
    next(error);
  }
});

// Get forum by ID with posts
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const forum = await prisma.forum.findUnique({
      where: { id: Number(id) },
      include: {
        posts: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!forum) {
      return next(new AppError('Forum not found', 404));
    }

    res.status(200).json({
      data: forum,
    });
  } catch (error) {
    logger.error('Error fetching forum:', error);
    next(error);
  }
});

// Update forum (admin only)
router.patch('/:id', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    // Verify admin status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return next(new AppError('Unauthorized - Admin access required', 403));
    }

    const forum = await prisma.forum.update({
      where: { id: Number(id) },
      data: updateData,
    });

    logger.info(`Forum updated: ${forum.id}`);
    res.status(200).json({
      message: 'Forum updated successfully',
      data: forum,
    });
  } catch (error) {
    logger.error('Error updating forum:', error);
    next(error);
  }
});

// Delete forum (admin only)
router.delete('/:id', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    // Verify admin status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return next(new AppError('Unauthorized - Admin access required', 403));
    }

    await prisma.forum.delete({
      where: { id: Number(id) },
    });

    logger.info(`Forum deleted: ${id}`);
    res.status(200).json({
      message: 'Forum deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting forum:', error);
    next(error);
  }
});

export default router;

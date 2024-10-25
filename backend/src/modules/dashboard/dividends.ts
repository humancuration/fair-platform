// backend/src/routes/dividends.ts
import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../../middleware/auth';
import { AppError } from '../../utils/errors';
import { createLogger } from '../../utils/logger';

const prisma = new PrismaClient();
const logger = createLogger('DividendsController');
const router = Router();

// Get all dividends (protected route)
router.get('/', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const dividends = await prisma.dividend.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json({
      data: dividends,
    });
  } catch (error) {
    logger.error('Error fetching dividends:', error);
    next(error);
  }
});

// Create a new dividend (admin only)
router.post('/', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  const { amount, recipientId } = req.body;
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

    const dividend = await prisma.dividend.create({
      data: {
        amount,
        recipient: {
          connect: { id: recipientId },
        },
      },
      include: {
        recipient: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    logger.info(`Dividend created for user ${recipientId}`);
    res.status(201).json({
      message: 'Dividend created successfully',
      data: dividend,
    });
  } catch (error) {
    logger.error('Error creating dividend:', error);
    next(error);
  }
});

// Distribute dividends to all users (admin only)
router.post('/distribute', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
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

    // Calculate total funds available for distribution
    const totalFunds = await calculateTotalDividends();

    // Get all eligible users
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: 'ADMIN', // Exclude admins from distribution
        },
      },
    });

    const dividendPerUser = totalFunds / users.length;

    // Create dividends for all users in a transaction
    await prisma.$transaction(
      users.map(user =>
        prisma.dividend.create({
          data: {
            amount: dividendPerUser,
            recipient: {
              connect: { id: user.id },
            },
          },
        })
      )
    );

    logger.info(`Dividends distributed to ${users.length} users`);
    res.status(200).json({
      message: 'Dividends distributed successfully',
      data: {
        totalUsers: users.length,
        totalDistributed: totalFunds,
        amountPerUser: dividendPerUser,
      },
    });
  } catch (error) {
    logger.error('Error distributing dividends:', error);
    next(error);
  }
});

// Helper function to calculate total dividends
async function calculateTotalDividends(): Promise<number> {
  // This is a placeholder implementation
  // Replace with your actual business logic for calculating available funds
  const result = await prisma.affiliateLink.aggregate({
    _sum: {
      clicks: true,
    },
  });

  // Example: $0.1 per click
  return (result._sum.clicks || 0) * 0.1;
}

export default router;

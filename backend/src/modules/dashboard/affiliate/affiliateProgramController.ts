// controllers/affiliateProgramController.ts

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../utils/errors';
import { createLogger } from '../../../utils/logger';

const prisma = new PrismaClient();
const logger = createLogger('AffiliateProgramController');

interface CreateAffiliateProgramDTO {
  name: string;
  description?: string;
  commissionRate: number;
}

/**
 * Create a new affiliate program
 */
export const createAffiliateProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, commissionRate } = req.body as CreateAffiliateProgramDTO;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    // Get the brand associated with the user
    const brand = await prisma.brand.findFirst({
      where: { userId },
    });

    if (!brand) {
      return next(new AppError('User has no associated brand', 404));
    }

    const newProgram = await prisma.affiliateProgram.create({
      data: {
        name,
        description,
        commissionRate,
        brand: {
          connect: { id: brand.id },
        },
        isActive: true,
      },
      include: {
        brand: true,
      },
    });

    logger.info(`Affiliate program created: ${newProgram.id}`);
    res.status(201).json({
      message: 'Affiliate program created successfully',
      data: newProgram,
    });
  } catch (error) {
    logger.error('Error creating affiliate program:', error);
    next(error);
  }
};

/**
 * Get all affiliate programs
 */
export const getAffiliatePrograms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [programs, total] = await Promise.all([
      prisma.affiliateProgram.findMany({
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          affiliateLinks: {
            select: {
              _count: true,
            },
          },
        },
        where: {
          isActive: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.affiliateProgram.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    res.status(200).json({
      data: programs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching affiliate programs:', error);
    next(error);
  }
};

/**
 * Get a specific affiliate program
 */
export const getAffiliateProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const program = await prisma.affiliateProgram.findUnique({
      where: { id: Number(id) },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        affiliateLinks: {
          select: {
            id: true,
            code: true,
            url: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!program) {
      return next(new AppError('Affiliate program not found', 404));
    }

    res.status(200).json({
      data: program,
    });
  } catch (error) {
    logger.error('Error fetching affiliate program:', error);
    next(error);
  }
};

/**
 * Update an affiliate program
 */
export const updateAffiliateProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const updateData = req.body;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    // Verify ownership through brand
    const program = await prisma.affiliateProgram.findFirst({
      where: {
        id: Number(id),
        brand: {
          userId,
        },
      },
    });

    if (!program) {
      return next(new AppError('Affiliate program not found or unauthorized', 404));
    }

    const updatedProgram = await prisma.affiliateProgram.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      include: {
        brand: true,
      },
    });

    logger.info(`Affiliate program ${id} updated by user ${userId}`);
    res.status(200).json({
      message: 'Affiliate program updated successfully',
      data: updatedProgram,
    });
  } catch (error) {
    logger.error('Error updating affiliate program:', error);
    next(error);
  }
};

/**
 * Delete an affiliate program
 */
export const deleteAffiliateProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    // Verify ownership through brand
    const program = await prisma.affiliateProgram.findFirst({
      where: {
        id: Number(id),
        brand: {
          userId,
        },
      },
    });

    if (!program) {
      return next(new AppError('Affiliate program not found or unauthorized', 404));
    }

    await prisma.affiliateProgram.delete({
      where: { id: Number(id) },
    });

    logger.info(`Affiliate program ${id} deleted by user ${userId}`);
    res.status(200).json({
      message: 'Affiliate program deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting affiliate program:', error);
    next(error);
  }
};

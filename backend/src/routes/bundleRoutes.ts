import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';
import logger from '../utils/logger';

const prisma = new PrismaClient();
const router = Router();

// Get all bundles
router.get('/', async (req, res) => {
  try {
    const bundles = await prisma.bundle.findMany({
      include: {
        bundleProducts: {
          include: {
            product: true
          }
        }
      }
    });
    res.json(bundles);
  } catch (error) {
    logger.error('Failed to fetch bundles:', error);
    res.status(500).json({ message: 'Failed to fetch bundles' });
  }
});

// Create new bundle
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const {
      name,
      description,
      totalPrice,
      discountedPrice,
      validFrom,
      validUntil,
      limitedQuantity,
      imageUrl,
      products,
    } = req.body;

    const bundle = await prisma.bundle.create({
      data: {
        name,
        description,
        totalPrice,
        discountedPrice,
        validFrom,
        validUntil,
        limitedQuantity,
        imageUrl,
        createdById: req.user.id,
        bundleProducts: {
          create: products.map((product: any) => ({
            productId: product.productId,
            quantity: product.quantity,
            discountPercentage: product.discountPercentage,
          }))
        }
      },
      include: {
        bundleProducts: {
          include: {
            product: true
          }
        }
      }
    });

    res.status(201).json(bundle);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create bundle' });
  }
});

// Update bundle stock
router.patch('/:id/stock', authenticateJWT, async (req, res) => {
  try {
    const { soldCount } = req.body;
    await prisma.bundle.update({
      where: { id: req.params.id },
      data: { soldCount }
    });
    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stock' });
  }
});

export default router;

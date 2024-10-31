import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Validation schemas using Zod
const EcoActivitySchema = z.object({
  groupId: z.number(),
  emissionsReduced: z.number().min(0),
  savings: z.number().min(0),
  resourcesShared: z.number().min(0)
});

const EcoTipSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['energy', 'waste', 'transport', 'food', 'community']),
  impact: z.string().optional(),
  imageUrl: z.string().url().optional()
});

// Get eco analytics data
router.get('/analytics', authenticateUser, async (req, res) => {
  try {
    const { groupId } = z.object({
      groupId: z.string().transform(val => parseInt(val))
    }).parse(req.query);

    const [ecoData, impact] = await Promise.all([
      prisma.ecoAnalytics.findMany({
        where: { groupId },
        orderBy: { date: 'desc' },
        take: 30
      }),
      prisma.ecoImpact.findUnique({
        where: { groupId }
      })
    ]);

    res.json({
      timeline: ecoData,
      impact,
      totalCarbonOffset: ecoData.reduce((sum, d) => sum + d.emissionsReduced, 0),
      totalSavings: ecoData.reduce((sum, d) => sum + d.savings, 0),
      resourcesShared: ecoData.reduce((sum, d) => sum + d.resourcesShared, 0)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to fetch eco analytics' });
  }
});

// Add eco tip
router.post('/tips', authenticateUser, async (req, res) => {
  try {
    const data = EcoTipSchema.parse(req.body);
    
    const tip = await prisma.ecoTip.create({
      data: {
        ...data,
        authorId: req.user.id
      }
    });

    res.status(201).json(tip);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create eco tip' });
  }
});

// Like eco tip
router.post('/tips/:id/like', authenticateUser, async (req, res) => {
  try {
    const { id } = z.object({
      id: z.string().transform(val => parseInt(val))
    }).parse(req.params);

    await prisma.ecoTipLike.create({
      data: {
        tipId: id,
        userId: req.user.id
      }
    });

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to like eco tip' });
  }
});

export default router;
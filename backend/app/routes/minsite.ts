import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import type { MinsiteCreateInput, MinsiteUpdateInput } from '@fair-platform/shared/types';

const router = Router();

// Get all minsites for user
router.get('/', requireAuth, async (req, res) => {
  const minsites = await prisma.minsite.findMany({
    where: { userId: req.user.id },
    include: {
      versions: true,
      uploads: true,
      affiliateLinks: true,
      analytics: {
        orderBy: { date: 'desc' },
        take: 1
      }
    }
  });
  res.json(minsites);
});

// Get single minsite
router.get('/:id', requireAuth, async (req, res) => {
  const minsite = await prisma.minsite.findUnique({
    where: { 
      id: req.params.id,
      userId: req.user.id 
    },
    include: {
      versions: true,
      uploads: true,
      affiliateLinks: true,
      analytics: {
        orderBy: { date: 'desc' },
        take: 30
      }
    }
  });

  if (!minsite) {
    return res.status(404).json({ error: 'Minsite not found' });
  }

  res.json(minsite);
});

// Create minsite
router.post('/', requireAuth, async (req, res) => {
  const data: MinsiteCreateInput = req.body;

  const minsite = await prisma.minsite.create({
    data: {
      ...data,
      user: {
        connect: { id: req.user.id }
      }
    },
    include: {
      versions: true,
      uploads: true,
      affiliateLinks: true,
      analytics: true
    }
  });

  res.json(minsite);
});

// Update minsite
router.put('/:id', requireAuth, async (req, res) => {
  const data: MinsiteUpdateInput = req.body;

  // Verify ownership
  const existing = await prisma.minsite.findUnique({
    where: { id: req.params.id }
  });

  if (!existing || existing.userId !== req.user.id) {
    return res.status(404).json({ error: 'Minsite not found' });
  }

  // Create version before updating
  if (data.content) {
    await prisma.minsiteVersion.create({
      data: {
        minsiteId: req.params.id,
        content: existing.content,
        title: existing.title,
        template: existing.template,
        customCSS: existing.customCSS
      }
    });
  }

  const minsite = await prisma.minsite.update({
    where: { id: req.params.id },
    data,
    include: {
      versions: true,
      uploads: true,
      affiliateLinks: true,
      analytics: true
    }
  });

  res.json(minsite);
});

// Delete minsite
router.delete('/:id', requireAuth, async (req, res) => {
  const minsite = await prisma.minsite.findUnique({
    where: { id: req.params.id }
  });

  if (!minsite || minsite.userId !== req.user.id) {
    return res.status(404).json({ error: 'Minsite not found' });
  }

  await prisma.minsite.delete({
    where: { id: req.params.id }
  });

  res.json({ success: true });
});

export default router;

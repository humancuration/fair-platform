import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Get all brands
router.get('/', async (req, res) => {
  try {
    const brands = await prisma.brand.findMany();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// Get a single brand by ID
router.get('/:id', async (req, res) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: req.params.id }
    });
    if (brand) {
      res.json(brand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
});

// Create a new brand
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const newBrand = await prisma.brand.create({
      data: req.body
    });
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create brand' });
  }
});

// Update a brand
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedBrand = await prisma.brand.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updatedBrand);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update brand' });
  }
});

// Delete a brand
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    await prisma.brand.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand' });
  }
});

export default router;

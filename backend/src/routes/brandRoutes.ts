import { Router } from 'express';
import Brand from '../modules/dashboard/affiliate/Brands';

const router = Router();

// Get all brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// Get a single brand by ID
router.get('/:id', async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
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
router.post('/', async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create brand' });
  }
});

// Update a brand
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Brand.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedBrand = await Brand.findByPk(req.params.id);
      res.json(updatedBrand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to update brand' });
  }
});

// Delete a brand
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Brand.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand' });
  }
});

export default router;

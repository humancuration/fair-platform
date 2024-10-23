import { Router } from 'express';
import Company from '../modules/marketplace/Company';

const router = Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get a single company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create a new company
router.post('/', async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create company' });
  }
});

// Update a company
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Company.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedCompany = await Company.findByPk(req.params.id);
      res.json(updatedCompany);
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to update company' });
  }
});

// Delete a company
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Company.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export default router;

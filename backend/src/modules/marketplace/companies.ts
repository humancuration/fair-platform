// backend/src/routes/companies.ts
import { Router, Request, Response } from 'express';
import Company from '../modules/marketplace/Company';
import auth from '../middleware/auth';

const router = Router();

// Get all companies
router.get('/', async (req: Request, res: Response) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new company (protected route)
router.post('/', auth, async (req: Request, res: Response) => {
  const { name, industry, description, referralTerms } = req.body;
  try {
    const company = await Company.create({ name, industry, description, referralTerms });
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single company by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

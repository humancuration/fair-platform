// backend/src/routes/grants.ts
import { Router, Request, Response } from 'express';
import Grant from '../models/Grant';
import auth from '../middleware/auth';

const router = Router();

// Apply for a grant
router.post('/', async (req: Request, res: Response) => {
  const { applicantName, projectDescription, amountRequested } = req.body;
  try {
    const grant = await Grant.create({ applicantName, projectDescription, amountRequested });
    res.status(201).json(grant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all grants (admin or based on role)
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const grants = await Grant.findAll();
    res.json(grants);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a grant (admin only)
router.put('/:id', auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amountGranted } = req.body;
  try {
    const grant = await Grant.findByPk(id);
    if (!grant) {
      return res.status(404).json({ message: 'Grant not found' });
    }
    grant.amountGranted = amountGranted;
    await grant.save();
    res.json(grant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

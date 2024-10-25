// backend/src/routes/dividends.ts
import { Router, Request, Response } from 'express';
import Dividend from '../../../../backup/models/Dividend';
import User from '../user/User'; // Assuming User is a model in your project
import auth from '../../middleware/auth';

const router = Router();

// Get all dividends (protected route)
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const dividends = await Dividend.findAll();
    res.json(dividends);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new dividend (protected route, assuming admin-only logic will be handled separately)
router.post('/', auth, async (req: Request, res: Response) => {
  const { amount, recipientId } = req.body;
  try {
    const dividend = await Dividend.create({ amount, recipientId });
    res.status(201).json(dividend);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Distribute dividends to all users (admin only)
router.post('/distribute', auth, async (req: Request, res: Response) => {
  // Ensure only admin can distribute dividends
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const totalFunds = await calculateTotalDividends(); // Implement this function based on your logic
    const users = await User.findAll();
    const dividendPerUser = totalFunds / users.length;

    for (const user of users) {
      await Dividend.create({ amount: dividendPerUser, recipientId: user.id });
    }

    res.json({ message: 'Dividends distributed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

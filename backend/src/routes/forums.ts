// backend/src/routes/forums.ts
import { Router, Request, Response } from 'express';
import Forum from '../models/Forum';
import auth from '../middleware/auth';

const router = Router();

// Get all forums
router.get('/', async (req: Request, res: Response) => {
  try {
    const forums = await Forum.findAll();
    res.json(forums);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new forum (admin only)
router.post('/', auth, async (req: Request, res: Response) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { title, description } = req.body;
  try {
    const forum = await Forum.create({ title, description });
    res.status(201).json(forum);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

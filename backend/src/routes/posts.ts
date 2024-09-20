// backend/src/routes/posts.ts
import { Router, Request, Response } from 'express';
import Post from '../models/Post';
import auth from '../middleware/auth';

const router = Router();

// Get all posts in a forum
router.get('/forum/:forumId', async (req: Request, res: Response) => {
  const { forumId } = req.params;
  try {
    const posts = await Post.findAll({ where: { forumId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new post in a forum
router.post('/forum/:forumId', auth, async (req: Request, res: Response) => {
  const { forumId } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;
  try {
    const post = await Post.create({ title, content, forumId, userId });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

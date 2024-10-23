import { Router } from 'express';
import { getFeed, createPost, likePost, repostPost } from './hybridPostController';
import auth from '../../middleware/auth';

const router = Router();

router.get('/feed', getFeed);
router.post('/post', auth, createPost);
router.post('/post/:id/like', auth, likePost);
router.post('/post/:id/repost', auth, repostPost);

export default router;

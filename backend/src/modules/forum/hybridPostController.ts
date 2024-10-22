import { Request, Response } from 'express';
import { HybridPost } from './hybridPostModel';
import { User } from '../user/User';

export const getFeed = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20; // Posts per page
    const offset = (page - 1) * limit;

    const posts = await HybridPost.findAndCountAll({
      where: { parentId: null }, // Only top-level posts
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: HybridPost, as: 'replies', separate: true, limit: 3 } // Preview of replies
      ]
    });

    res.json({
      posts: posts.rows,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feed' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, isThread, parentId, mentions, hashtags, attachments, visibility, sensitive, spoilerText } = req.body;
    const userId = req.user.id;

    const post = await HybridPost.create({
      content,
      isThread,
      parentId,
      userId,
      mentions,
      hashtags,
      attachments,
      visibility,
      sensitive,
      spoilerText,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await HybridPost.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likesCount += 1;
    await post.save();

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post' });
  }
};

export const repostPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const originalPost = await HybridPost.findByPk(postId);

    if (!originalPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const repost = await HybridPost.create({
      content: originalPost.content,
      userId,
      parentId: originalPost.id,
      isThread: false,
      mentions: originalPost.mentions,
      hashtags: originalPost.hashtags,
      attachments: originalPost.attachments,
      visibility: originalPost.visibility,
      sensitive: originalPost.sensitive,
      spoilerText: originalPost.spoilerText,
    });

    originalPost.repostsCount += 1;
    await originalPost.save();

    res.status(201).json(repost);
  } catch (error) {
    res.status(500).json({ message: 'Error reposting' });
  }
};

import { Request, Response } from 'express';
import WishlistItem from '../models/WishlistItem';
import User from '../models/User';

export const getWishlist = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addWishlistItem = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, description, image, isPublic } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  try {
    const newItem = new WishlistItem({
      user: userId,
      name,
      description,
      image: image || '',
      isPublic: isPublic || false,
    });

    await newItem.save();

    const user = await User.findById(userId);
    if (user) {
      user.wishlist.push(newItem._id);
      await user.save();
    }

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding wishlist item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateWishlistItem = async (req: Request, res: Response) => {
  const { userId, itemId } = req.params;
  const { isPublic } = req.body;

  try {
    const item = await WishlistItem.findOne({ _id: itemId, user: userId });
    if (!item) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    item.isPublic = isPublic;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicWishlistByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).populate({
      path: 'wishlist',
      match: { isPublic: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      wishlist: user.wishlist,
      fediverseProfile: user.fediverseProfile,
    });
  } catch (error) {
    console.error('Error fetching public wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
import { Request, Response } from 'express';
import CommunityWishlistItem from '../models/CommunityWishlistItem';
import User from '../models/User';

export const getCommunityWishlist = async (req: Request, res: Response) => {
  try {
    const items = await CommunityWishlistItem.find().populate('user', 'username').sort({ date: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching community wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addCommunityWishlistItem = async (req: Request, res: Response) => {
  const userId = req.user.id; // Assuming you have user info in the request after authentication
  const { name, description, image, targetAmount } = req.body;

  if (!name || !description || !targetAmount) {
    return res.status(400).json({ message: 'Name, description, and target amount are required' });
  }

  try {
    const newItem = new CommunityWishlistItem({
      user: userId,
      name,
      description,
      image: image || '',
      targetAmount,
      currentAmount: 0,
    });

    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding community wishlist item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const contributeToItem = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Valid amount is required' });
  }

  try {
    const item = await CommunityWishlistItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    item.currentAmount += amount;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error('Error contributing to wishlist item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
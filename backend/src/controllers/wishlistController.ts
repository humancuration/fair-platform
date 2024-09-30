import { Request, Response } from 'express';
import { PrivateWishlist, PublicWishlist, CommunityWishlistItem, IWishlistItem } from '../models/Wishlist';
import { User } from '../models/User';

export const upsertPrivateWishlist = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const items: IWishlistItem[] = req.body.items;

  try {
    const [wishlist, created] = await PrivateWishlist.findOrCreate({
      where: { userId },
      defaults: { items },
    });

    if (!created) {
      await wishlist.update({ items });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error upserting private wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPrivateWishlist = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;

  try {
    const wishlist = await PrivateWishlist.findOne({ where: { userId } });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching private wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const upsertPublicWishlist = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const items: IWishlistItem[] = req.body.items;
  const fediverseProfile: string = req.body.fediverseProfile;

  try {
    const [wishlist, created] = await PublicWishlist.findOrCreate({
      where: { userId },
      defaults: { items, fediverseProfile },
    });

    if (!created) {
      await wishlist.update({ items, fediverseProfile });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error upserting public wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicWishlistByUsername = async (req: Request, res: Response) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wishlist = await PublicWishlist.findOne({ where: { userId: user.id } });
    if (!wishlist) {
      return res.status(404).json({ message: 'Public Wishlist not found' });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching public wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addCommunityWishlistItem = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const item: IWishlistItem = req.body.item;

  try {
    const communityItem = await CommunityWishlistItem.create({
      userId,
      item,
    });

    res.status(201).json(communityItem);
  } catch (error) {
    console.error('Error adding community wishlist item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommunityWishlist = async (req: Request, res: Response) => {
  try {
    const communityWishlist = await CommunityWishlistItem.findAll({
      include: [{ model: User, attributes: ['username', 'avatar'] }],
    });
    res.status(200).json(communityWishlist);
  } catch (error) {
    console.error('Error fetching community wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const contributeToCommunityWishlist = async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.itemId);
  const userId = (req.user as any).id;
  const contributionAmount: number = req.body.amount;

  try {
    const communityItem = await CommunityWishlistItem.findByPk(itemId);
    if (!communityItem) {
      return res.status(404).json({ message: 'Community Wishlist Item not found' });
    }

    communityItem.contributors = [...communityItem.contributors, userId];
    communityItem.totalContributions += contributionAmount;

    await communityItem.save();
    res.status(200).json(communityItem);
  } catch (error) {
    console.error('Error contributing to community wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
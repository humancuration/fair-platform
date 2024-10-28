import { Request, Response } from 'express';
import { Wishlist } from './Wishlist';
import { User } from '../user/User';
import { WishlistItem } from './WishlistItem';
import { CommunityWishlist } from './CommunityWishlist';

export const upsertWishlist = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { name, description, isPublic, items } = req.body;

  try {
    const [wishlist, created] = await Wishlist.findOrCreate({
      where: { userId, name },
      defaults: { description, isPublic },
    });

    if (!created) {
      await wishlist.update({ description, isPublic });
    }

    if (items && items.length > 0) {
      await WishlistItem.bulkCreate(
        items.map((item: any) => ({ ...item, wishlistId: wishlist.id })),
        { updateOnDuplicate: ['name', 'description', 'price', 'url'] }
      );
    }

    const updatedWishlist = await Wishlist.findByPk(wishlist.id, {
      include: [WishlistItem],
    });

    res.status(200).json(updatedWishlist);
  } catch (error) {
    console.error('Error upserting wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { name } = req.params;

  try {
    const wishlist = await Wishlist.findOne({
      where: { userId, name },
      include: [WishlistItem],
    });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
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

    const wishlist = await Wishlist.findOne({
      where: { userId: user.id, isPublic: true },
      include: [WishlistItem],
    });
    if (!wishlist) {
      return res.status(404).json({ message: 'Public Wishlist not found' });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching public wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Community Wishlist functions
export const addCommunityWishlistItem = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { name, description, image, price, communityName } = req.body;

  try {
    const communityItem = await CommunityWishlist.create({
      userId,
      name,
      description,
      image,
      price,
      communityName,
    });

    res.status(201).json(communityItem);
  } catch (error) {
    console.error('Error adding community wishlist item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommunityWishlist = async (req: Request, res: Response) => {
  try {
    const communityWishlist = await CommunityWishlist.findAll({
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
    const communityItem = await CommunityWishlist.findByPk(itemId);
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

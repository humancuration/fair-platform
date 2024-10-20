import { Request, Response } from 'express';
import CommunityWishlist from '@/modulesb/wishlist/CommunityWishlist';
import User from '@models/User';

export const getCommunityWishlist = async (_req: Request, res: Response) => {
  try {
    const communityWishlist = await CommunityWishlist.findAll({
      order: [
        ['highlighted', 'DESC'],
        ['date', 'DESC']
      ],
      limit: 50,
      include: [{ model: User, attributes: ['username', 'avatar'] }]
    });
    res.json(communityWishlist);
  } catch (error) {
    console.error('Error fetching community wishlist:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const highlightItem = async (req: Request, res: Response) => {
  const { productId } = req.body;

  try {
    await CommunityWishlist.update({ highlighted: false }, { where: {} });

    const [updatedRowsCount, updatedItems] = await CommunityWishlist.update(
      { highlighted: true },
      { where: { productId }, returning: true }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json({ highlightedProductId: updatedItems[0].productId });
  } catch (error) {
    console.error('Error highlighting item:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const addToCommunityWishlist = async (req: Request, res: Response) => {
  const { productId, name, image, price } = req.body;

  try {
    const newItem = await CommunityWishlist.create({
      productId,
      name,
      image,
      price,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item to community wishlist:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
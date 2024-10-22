import { Request, Response } from 'express';
import { CommunityWishlist } from './CommunityWishlist';
import { User } from '../user/User';
import { Op } from 'sequelize';

export const getCommunityWishlist = async (req: Request, res: Response) => {
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
  const { productId, name, image, price, communityName } = req.body;
  const userId = (req.user as any).id;

  try {
    const newItem = await CommunityWishlist.create({
      userId,
      productId,
      name,
      image,
      price,
      communityName,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item to community wishlist:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const searchCommunityWishlist = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const results = await CommunityWishlist.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { communityName: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{ model: User, attributes: ['username', 'avatar'] }],
      limit: 20
    });

    res.json(results);
  } catch (error) {
    console.error('Error searching community wishlist:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// controllers/linkInBioController.ts

import { Request, Response } from 'express';
import User from '../models/User';
import AffiliateLink from '../models/AffiliateLink';

export const getLinkInBio = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const affiliateLinks = await AffiliateLink.findAll({
      where: { creatorId: user.id },
      include: [AffiliateProgram],
    });

    res.json(affiliateLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

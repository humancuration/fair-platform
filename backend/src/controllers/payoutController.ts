// controllers/payoutController.ts

import { Request, Response } from 'express';
import Payout from '../models/Payout';
import AffiliateLink from '../models/AffiliateLink';
import { Op } from 'sequelize';

export const initiatePayout = async (req: Request, res: Response) => {
  const { linkId } = req.body;
  const creatorId = req.user.id; // Assuming authentication middleware sets req.user

  try {
    const affiliateLink = await AffiliateLink.findOne({ where: { id: linkId, creatorId } });

    if (!affiliateLink) {
      return res.status(404).json({ message: 'Affiliate Link Not Found' });
    }

    const commission = affiliateLink.conversions * (affiliateLink.affiliateProgram.commissionRate / 100);

    if (commission <= 0) {
      return res.status(400).json({ message: 'No commission available for payout' });
    }

    const newPayout = await Payout.create({
      affiliateLinkId: affiliateLink.id,
      amount: commission,
      status: 'pending',
    });

    // TODO: Integrate with payment gateway to process payout
    // For now, we'll assume payout is successful
    newPayout.status = 'completed';
    newPayout.transactionId = 'txn_' + newPayout.id;
    await newPayout.save();

    res.status(200).json({ message: 'Payout initiated', payout: newPayout });
  } catch (error) {
    console.error('Error initiating payout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPayouts = async (req: Request, res: Response) => {
  const creatorId = req.user.id;

  try {
    const payouts = await Payout.findAll({
      where: { '$AffiliateLink.creatorId$': creatorId },
      include: [{ model: AffiliateLink }],
    });

    res.status(200).json(payouts);
  } catch (error) {
    console.error('Error fetching payouts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// controllers/payoutController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export const initiatePayout = async (req: Request, res: Response) => {
  const { linkId } = req.body;
  const creatorId = req.user?.id; // Using optional chaining

  try {
    const affiliateLink = await prisma.affiliateLink.findFirst({
      where: { 
        id: linkId, 
        creatorId 
      },
      include: {
        program: true
      }
    });

    if (!affiliateLink) {
      return res.status(404).json({ message: 'Affiliate Link Not Found' });
    }

    const commission = affiliateLink.conversions * (affiliateLink.program.commissionRate / 100);

    if (commission <= 0) {
      return res.status(400).json({ message: 'No commission available for payout' });
    }

    const newPayout = await prisma.payout.create({
      data: {
        amount: commission,
        status: 'PENDING',
        affiliateLink: {
          connect: { id: affiliateLink.id }
        }
      }
    });

    // Update payout status
    const updatedPayout = await prisma.payout.update({
      where: { id: newPayout.id },
      data: {
        status: 'COMPLETED',
        transactionId: `txn_${newPayout.id}`
      }
    });

    res.status(200).json({ message: 'Payout initiated', payout: updatedPayout });
  } catch (error) {
    logger.error('Error initiating payout:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPayouts = async (req: Request, res: Response) => {
  const creatorId = req.user?.id;

  try {
    const payouts = await prisma.payout.findMany({
      where: {
        affiliateLink: {
          creatorId
        }
      },
      include: {
        affiliateLink: true
      }
    });

    res.status(200).json(payouts);
  } catch (error) {
    logger.error('Error fetching payouts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

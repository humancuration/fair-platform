import { Request, Response } from 'express';
import { Campaign } from '@/modules/campaign/Campaign';
import _Contribution from '@/modules/campaign/Contribution';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createContribution = async (req: Request, res: Response) => {
  try {
    const { campaignId, amount, reward } = req.body;
    const contributor = req.user.id;

    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign || !campaign.isActive) {
      return res.status(404).json({ message: 'Campaign not found or inactive' });
    }

    // Create a Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: {
        campaignId,
        contributorId: contributor,
        reward: reward || '',
      },
    });

    // Respond with the client secret to complete the payment on the frontend
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating contribution:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Additional functions can be added here as needed
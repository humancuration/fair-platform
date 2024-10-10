import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import Contribution from '../models/Contribution';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export const createContribution = async (req: Request, res: Response) => {
  try {
    const { campaignId, amount, reward } = req.body;
    const contributor = req.user.id;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign || !campaign.isActive) {
      return res.status(404).json({ message: 'Campaign not found or inactive' });
    }

    // Create a Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        campaignId,
        contributorId: contributor,
        reward: reward || '',
      },
    });

    // Respond with the client secret to complete the payment on the frontend
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating contribution:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await fulfillContribution(paymentIntent);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Function to fulfill contribution after successful payment
const fulfillContribution = async (paymentIntent: Stripe.PaymentIntent) => {
  const { campaignId, contributorId, reward } = paymentIntent.metadata;

  const campaign = await Campaign.findById(campaignId);

  if (!campaign) {
    console.error('Campaign not found for payment intent:', paymentIntent.id);
    return;
  }

  const amount = paymentIntent.amount_received / 100; // Convert back to dollars

  // Create Contribution record
  const contribution = new Contribution({
    campaign: campaignId,
    contributor: contributorId,
    amount,
    reward: reward || '',
    paymentIntentId: paymentIntent.id,
  });

  await contribution.save();

  // Update Campaign's amountRaised
  campaign.amountRaised += amount;
  await campaign.save();
};
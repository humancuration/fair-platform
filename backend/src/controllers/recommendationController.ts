// controllers/recommendationController.ts

import { Request, Response } from 'express';
import axios from 'axios';

export const getAffiliateRecommendations = async (req: Request, res: Response) => {
  try {
    const creatorProfile = req.body.profile; // Extract from user data

    const aiResponse = await axios.post('http://ai_service:5002/recommend-affiliate-programs', {
      profile: creatorProfile,
    });

    res.json(aiResponse.data);
  } catch (error) {
    console.error('Error fetching AI recommendations', error);
    res.status(500).json({ message: 'Server error' });
  }
};

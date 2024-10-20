// controllers/affiliateProgramController.ts

import { Request, Response } from 'express';
import AffiliateProgram from '@models/AffiliateProgram';
import Brand from '@/modules/dashboard/affiliate/Brands';

export const createAffiliateProgram = async (req: Request, res: Response) => {
  const { name, description, commissionRate } = req.body;
  const brandId = req.user.brandId; // Assuming authenticated brand user

  try {
    const newProgram = await AffiliateProgram.create({
      brandId,
      name,
      description,
      commissionRate,
    });

    res.status(201).json(newProgram);
  } catch (error) {
    console.error('Error creating affiliate program:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAffiliatePrograms = async (_req: Request, res: Response) => {
  try {
    const programs = await AffiliateProgram.findAll({
      include: [{ model: Brand }],
    });
    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching affiliate programs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

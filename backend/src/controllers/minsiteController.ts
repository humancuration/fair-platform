import { Request, Response } from 'express';
import Minsite from '../models/Minsite'; // Ensure this path is correct based on your project structure

interface AuthRequest extends Request {
  user?: any; // Replace 'any' with your User type if available
}

export const saveMinsite = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const newMinsite = await Minsite.create({
      title,
      content,
      userId,
    });

    res.status(201).json({ message: 'Minsite created successfully.', minisite: newMinsite });
  } catch (error) {
    console.error('Error saving minisite:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

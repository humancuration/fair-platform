import { Request, Response } from 'express';
import { Testimonial } from '../../../backup/models/Testimonial';
import { User } from '../modules/user/User';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.findAll({
      include: [{ model: User, attributes: ['username', 'avatar'] }],
    });
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addTestimonial = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { content, fediversePostUrl } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const testimonial = await Testimonial.create({
      userId: user.id,
      content,
      fediversePostUrl,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
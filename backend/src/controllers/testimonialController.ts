import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.find().sort({ date: -1 }).limit(50);
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addTestimonial = async (req: Request, res: Response) => {
  const { user, content, avatar } = req.body;

  if (!user || !content) {
    return res.status(400).json({ message: 'Please provide user and content' });
  }

  try {
    const newTestimonial = new Testimonial({
      user,
      content,
      avatar: avatar || '',
      date: new Date(),
    });

    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
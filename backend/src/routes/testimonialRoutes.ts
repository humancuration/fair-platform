import express from 'express';
import { getTestimonials, addTestimonial } from '../controllers/testimonialController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public route to get testimonials
router.get('/', getTestimonials);

// Protected route to add a testimonial
router.post('/', authMiddleware, addTestimonial);

export default router;
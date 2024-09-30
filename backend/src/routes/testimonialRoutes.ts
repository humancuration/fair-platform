import express from 'express';
import { getTestimonials, addTestimonial } from '../controllers/testimonialController';
import auth from '../middleware/auth';

const router = express.Router();

// Public route to get testimonials
router.get('/', getTestimonials);

// Protected route to add a testimonial
router.post('/', auth, addTestimonial);

export default router;
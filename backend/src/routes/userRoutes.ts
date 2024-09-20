import { Router } from 'express';
import { register, login } from '../controllers/userController';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['creator', 'brand']),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists(),
  ],
  login
);

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../modulesb/user/User';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password (min 8 characters, must contain a number and an uppercase letter)
 *               role:
 *                 type: string
 *                 enum: [creator, business]
 *                 description: The user's role in the platform
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
router.post(
  '/register',
  [
    check('username').notEmpty().withMessage('Username is required').trim().escape(),
    check('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/\d/).withMessage('Password must contain a number')
      .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter'),
    check('role').isIn(['creator', 'business']).withMessage('Role must be either creator or business'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError('Validation error', 400));
    }

    const { username, email, password, role } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return next(new AppError('User already exists', 400));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (err) {
      next(new AppError('Server error', 500));
    }
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Validation error or invalid credentials
 *       500:
 *         description: Server error
 */
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError('Validation error', 400));
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(new AppError('Invalid credentials', 400));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new AppError('Invalid credentials', 400));
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      next(new AppError('Server error', 500));
    }
  }
);

export default router;

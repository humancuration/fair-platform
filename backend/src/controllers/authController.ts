import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import { createDiscourseUser } from '../services/discourseService';
import { createMoodleUser } from '../services/moodleService';
import logger from '../utils/logger';

const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
const REFRESH_EXPIRATION = '7d';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error: any = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error: any = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRATION }
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export { login };

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: 'Refresh Token Required' });
    }

    const payload = jwt.verify(token, REFRESH_SECRET) as any;
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid Refresh Token' });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken });
  } catch (err) {
    logger.error('Error refreshing token:', err);
    res.status(403).json({ message: 'Invalid Refresh Token' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    // Existing user registration logic...

    // Create Moodle user
    await createMoodleUser({
      username: user.username,
      password: req.body.password, // Note: Consider security implications
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};
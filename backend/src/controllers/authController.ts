import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@models/User';
import { JWT_SECRET } from '@config/constants';
import { createDiscourseUser as _createDiscourseUser } from '@services/discourseService';
import { createMoodleUser } from '@services/moodleService';
import logger from '@utils/logger';

const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
const REFRESH_EXPIRATION = '7d';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
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
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
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
    const user = await User.findOne({ where: { id: payload.id } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Refresh Token' });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
  return res.status(500).json({ message: 'Internal Server Error' }); // Ensure a return value for all paths
};

export const register = async (req: Request, res: Response) => {
  try {
    // Existing user registration logic...

    // Log registration attempt
    logger.info(`Registration attempt for email: ${req.body.email}`);

    // Create Moodle user
    const user = await User.findOne({ where: { email: req.body.email } }) as User & { username: string; firstName: string; lastName: string; email: string }; // Assert that user has firstName, lastName, and email
    if (!user) {
      const error: any = new Error('User not found');
      error.status = 404;
      throw error;
    }

    await createMoodleUser({
      username: user.username, // Now TypeScript recognizes username
      password: req.body.password, // Note: Consider security implications
      firstName: user.firstName, // Ensure firstName is also defined in User
      lastName: user.lastName, // Ensure lastName is also defined in User
      email: user.email, // Ensure email is also defined in User
    });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role }, // Generate token for the user
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ user, accessToken }); // Changed token to accessToken
  } catch (error) {
    logger.error('Registration error:', error); // Log the error
    res.status(500).json({ message: 'Error registering user' });
  }
};

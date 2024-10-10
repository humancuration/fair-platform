import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import { createDiscourseUser } from '../services/discourseService';
import { createMoodleUser } from '../services/moodleService';

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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export { login };

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
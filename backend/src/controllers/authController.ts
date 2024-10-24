import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET, REFRESH_SECRET, REFRESH_EXPIRATION } from '../config/constants';
import { createMoodleUser } from '../services/moodleService';
import logger from '../utils/logger';
import { ValidationError } from '../utils/errors';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`);
      return next(new ValidationError('User not found'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid credentials for email: ${email}`);
      return next(new ValidationError('Invalid credentials'));
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

    res.json({ message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    logger.error('Login error:', error);
    next(new Error('Failed to login'));
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;
  if (!token) {
    return next(new ValidationError('Refresh Token Required'));
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    });
    
    if (!user) {
      return next(new ValidationError('Invalid Refresh Token'));
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken });
  } catch (error) {
    logger.error('Refresh token error:', error);
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, username, firstName, lastName } = req.body;
  try {
    logger.info(`Registration attempt for email: ${email}`);

    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        username,
        firstName,
        lastName,
      },
    });

    await createMoodleUser({
      username,
      password,
      firstName,
      lastName,
      email,
    });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ user, accessToken });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

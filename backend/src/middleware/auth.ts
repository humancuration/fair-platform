// middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import marketplaceRoutes from './routes/marketplace';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use('/marketplace', marketplaceRoutes);

app.use(errorHandler);

interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findByPk(payload.id);
    if (!user) return res.sendStatus(401);
    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating token:', error);
    res.sendStatus(403);
  }
};

export const authorizeRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.sendStatus(403);
    }
    next();
  };
};

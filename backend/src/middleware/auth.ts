// middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    // ... other user properties
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

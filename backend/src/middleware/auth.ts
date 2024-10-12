import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Use User instead of UserDocument

interface AuthRequest extends Request {
  user?: User; // Update this to use User
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = decoded as any; // You might want to fetch the user from the database here
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

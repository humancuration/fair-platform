import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

interface AuthRequest extends Request {
  user?: {
    id: string;
    permissions: string[];
  };
}

class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(new AuthError('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; permissions: string[] };
    req.user = decoded;
    next();
  } catch (err) {
    logger.error(`JWT verification failed: ${err}`);
    next(new AuthError('Invalid token', 401));
  }
};

export const authorizeVersionControl = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.permissions.includes('version-control')) {
    next();
  } else {
    next(new AuthError('Access denied. Version control permission required.', 403));
  }
};

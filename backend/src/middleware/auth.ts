import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: string;
    permissions: string[];
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', ');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; permissions: string[] };
    req.user = decoded;

    // Ensure user has access to version control
    if (req.user && req.user.permissions.includes('version-control')) {
      next();
    } else {
      res.status(403).send({ message: 'Access denied. Version control permission required.' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
  return next();
};

export const authorizeVersionControl = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.permissions.includes('version-control')) {
    next();
  } else {
    res.status(403).send({ message: 'Access denied. Version control permission required.' });
  }
};

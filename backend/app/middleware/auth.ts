import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';
import { z } from 'zod';

// Define types
export interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// Validation schemas
const TokenPayloadSchema = z.object({
  userId: z.number(),
  email: z.string().email(),
  role: z.nativeEnum(Role)
});

// Error handling
class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Helper functions
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as z.infer<typeof TokenPayloadSchema>;
  } catch (error) {
    throw new AuthError('Invalid token');
  }
};

const extractToken = (authHeader?: string) => {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('No token provided');
  }
  return authHeader.split(' ')[1];
};

// Middleware
export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req.headers.authorization);
    const decoded = verifyToken(token);
    
    // Validate token payload
    const validatedPayload = TokenPayloadSchema.parse(decoded);

    const user = await prisma.user.findUnique({
      where: { id: validatedPayload.userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      throw new AuthError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid token payload' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

export const requireRoles = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthError('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AuthError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Authorization error' });
    }
  };
};

// Usage example:
// router.get('/admin', requireAuth, requireRoles([Role.ADMIN]), adminController);

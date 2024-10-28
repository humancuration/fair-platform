import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';
import { prisma } from '../config/prisma';

export const checkPermissions = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return next(new ForbiddenError('User not authenticated'));
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
          role: true,
          groupMemberships: {
            include: {
              group: true
            }
          }
        }
      });

      if (!user) {
        return next(new ForbiddenError('User not found'));
      }

      const hasPermission = requiredPermissions.every(permission => 
        user.role.permissions.includes(permission) ||
        user.groupMemberships.some(membership => 
          membership.group.permissions.includes(permission)
        )
      );

      if (!hasPermission) {
        return next(new ForbiddenError('Insufficient permissions'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Resource ownership middleware
export const checkOwnership = (resourceType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const resourceId = req.params.id;

    if (!userId || !resourceId) {
      return next(new ForbiddenError('Missing user or resource ID'));
    }

    try {
      const resource = await prisma[resourceType].findUnique({
        where: { id: parseInt(resourceId) }
      });

      if (!resource) {
        return next(new ForbiddenError('Resource not found'));
      }

      if (resource.userId !== parseInt(userId)) {
        return next(new ForbiddenError('Not authorized to access this resource'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

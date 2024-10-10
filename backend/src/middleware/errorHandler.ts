import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
};
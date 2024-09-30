import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: ValidationError) => ({
      field: error.param,
      message: error.msg,
    }));
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: formattedErrors 
    });
  }
  next();
};

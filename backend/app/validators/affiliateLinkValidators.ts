import { body } from 'express-validator';

export const validateCreateAffiliateLink = [
  body('affiliateProgramId')
    .notEmpty()
    .withMessage('Affiliate program ID is required')
    .isInt()
    .withMessage('Affiliate program ID must be an integer'),
  
  body('originalLink')
    .notEmpty()
    .withMessage('Original link is required')
    .isURL()
    .withMessage('Original link must be a valid URL'),
  
  body('customAlias')
    .optional()
    .isString()
    .withMessage('Custom alias must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('Custom alias must be between 3 and 50 characters long')
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage('Custom alias can only contain letters, numbers, hyphens, and underscores'),
];

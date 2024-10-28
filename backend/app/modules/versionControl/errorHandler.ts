import { Response } from 'express';
import logger from '../../utils/logger';
import { VersionControlError } from './types';

export const handleVersionControlError = (res: Response, error: unknown, operation: string) => {
  logger.error(`Version control error during ${operation}:`, error);

  if (error instanceof VersionControlError) {
    return res.status(400).json({
      message: `Failed to ${operation}`,
      error: error.message,
      code: error.code,
      details: error.details
    });
  }

  if (error instanceof Error) {
    // Handle known error types
    if (error.message.includes('Authentication failed')) {
      return res.status(401).json({
        message: 'Authentication failed',
        error: error.message
      });
    }

    if (error.message.includes('Permission denied')) {
      return res.status(403).json({
        message: 'Permission denied',
        error: error.message
      });
    }

    if (error.message.includes('Not found')) {
      return res.status(404).json({
        message: 'Resource not found',
        error: error.message
      });
    }
  }

  // Default to 500 for unknown errors
  res.status(500).json({
    message: `Internal server error during ${operation}`,
    error: error instanceof Error ? error.message : String(error)
  });
};

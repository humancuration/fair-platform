import { Request, Response, NextFunction } from 'express';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import logger from '../utils/logger';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: { [key: string]: string[] };
  stripIgnoreTag?: boolean;
  stripIgnoreTagBody?: boolean | string[];
}

export const sanitizeBody = (options: SanitizeOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body) {
        const sanitizeValue = (value: any): any => {
          if (typeof value === 'string') {
            return DOMPurify.sanitize(value, {
              ALLOWED_TAGS: options.allowedTags || ['b', 'i', 'em', 'strong', 'a'],
              ALLOWED_ATTR: options.allowedAttributes || ['href'],
              STRIP_IGNORING_TAG: options.stripIgnoreTag,
              STRIP_IGNORING_TAG_BODY: options.stripIgnoreTagBody,
            });
          }
          if (typeof value === 'object' && value !== null) {
            return Array.isArray(value)
              ? value.map(sanitizeValue)
              : Object.fromEntries(
                  Object.entries(value).map(([k, v]) => [k, sanitizeValue(v)])
                );
          }
          return value;
        };

        req.body = sanitizeValue(req.body);
      }
      next();
    } catch (error) {
      logger.error('Sanitization error:', error);
      next(error);
    }
  };
};

// HTML escape middleware for query parameters
export const escapeQueryParams = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.query) {
        const escapeValue = (value: any): any => {
          if (typeof value === 'string') {
            return value
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
          }
          return value;
        };

        req.query = Object.fromEntries(
          Object.entries(req.query).map(([k, v]) => [k, escapeValue(v)])
        );
      }
      next();
    } catch (error) {
      logger.error('Query escaping error:', error);
      next(error);
    }
  };
};

import crypto from 'crypto';

export const generateTrackingCode = (length: number = 8): string => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
export const REFRESH_EXPIRATION = process.env.REFRESH_EXPIRATION || '7d';
export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/fair-market';

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  AFFILIATE_LINKS: '/affiliate-links',
  PAYOUTS: '/payouts',
  EVENTS: '/events',
  GROUPS: '/groups'
};

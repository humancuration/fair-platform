export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/fair-market';

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  AFFILIATE_LINKS: '/affiliate-links',
  // Add more endpoints as needed
};
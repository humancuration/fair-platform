import axios from 'axios';
import { API_ENDPOINTS } from './constants';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const login = (credentials: { email: string; password: string }) =>
  api.post(API_ENDPOINTS.LOGIN, credentials);

// Define other API calls similarly
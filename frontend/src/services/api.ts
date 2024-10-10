// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: 'https://your-api-base-url.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const fetchProducts = () => api.get('/marketplace/products');
export const searchProducts = (params: any) => api.get('/marketplace/search', { params });
export const fetchRecommendations = () => api.get('/marketplace/recommendations');

export default api;
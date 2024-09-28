import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
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

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    alert('An error occurred. Please try again.');
    return Promise.reject(error);
  }
);

export const fetchProducts = () => api.get('/marketplace/products');
export const searchProducts = (params: any) => api.get('/marketplace/search', { params });
export const fetchRecommendations = () => api.get('/marketplace/recommendations');

export default api;

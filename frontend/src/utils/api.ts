import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    alert('An error occurred. Please try again.');
    return Promise.reject(error);
  }
);

export default api;
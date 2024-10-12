import api from '../utils/api';
import { API_ENDPOINTS } from '../constants';

export const login = (credentials: { email: string; password: string }) => {
  return api.post(API_ENDPOINTS.LOGIN, credentials);
};

export const signUp = async (userData: {
  name: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

import api from '../utils/api';
import { API_ENDPOINTS } from '../constants';

export const login = (credentials: { email: string; password: string }) => {
  return api.post(API_ENDPOINTS.LOGIN, credentials);
};
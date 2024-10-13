import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const createAffiliateLink = (data: any) => api.post('/affiliate-links', data);
export const getAffiliateLinks = () => api.get('/affiliate-links');
export const trackAffiliateClick = (trackingCode: string) => api.get(`/affiliate-links/track/${trackingCode}`);

export const createAffiliateProgram = (data: any) => api.post('/affiliate-programs', data);
export const getAffiliatePrograms = () => api.get('/affiliate-programs');

export const createCampaign = (data: any) => api.post('/campaigns', data);
export const getCampaigns = () => api.get('/campaigns');
export const getCampaignById = (id: string) => api.get(`/campaigns/${id}`);
export const updateCampaign = (id: string, data: any) => api.put(`/campaigns/${id}`, data);
export const deleteCampaign = (id: string) => api.delete(`/campaigns/${id}`);

export const trackEvent = (eventData: any) => api.post('/analytics/track', eventData);
export const getAggregateData = (params: any) => api.get('/analytics/aggregate', { params });

export const createAIEthicsCourse = (data: any) => api.post('/ai-ethics/courses', data);
export const addReflectionActivity = (data: any) => api.post('/ai-ethics/activities', data);

// New reward-related functions
export const getAvailableRewards = () => api.get('/rewards');
export const redeemReward = (rewardId: string) => api.post('/rewards/redeem', { rewardId });
export const addReward = (campaignId: string, rewardData: any) => api.post('/rewards', { campaignId, ...rewardData });
export const getRewardsByCampaign = (campaignId: string) => api.get(`/rewards/campaign/${campaignId}`);

// Add the new initializeRepository function
export const initializeRepository = (repoName: string) => {
  return api.post('/version-control/initialize', { repoName });
};

export default api;

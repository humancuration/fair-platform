import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAvailableRewards = async () => {
  const response = await axios.get(`${API_URL}/rewards`);
  return response.data;
};

export const redeemReward = async (rewardId: string) => {
  const response = await axios.post(`${API_URL}/rewards/redeem`, { rewardId });
  return response.data;
};

export const addReward = async (campaignId: string, rewardData: any) => {
  const response = await axios.post(`${API_URL}/rewards`, { campaignId, ...rewardData });
  return response.data;
};

export const getRewardsByCampaign = async (campaignId: string) => {
  const response = await axios.get(`${API_URL}/rewards/campaign/${campaignId}`);
  return response.data;
};

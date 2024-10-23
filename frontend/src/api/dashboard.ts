import api from './api';

interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  // Add more stats as needed
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/api/dashboard/stats');
  return response.data;
};

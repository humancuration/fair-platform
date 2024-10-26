import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface SalesMetrics {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  conversionRate: number;
  affiliatePerformance: Array<{
    userId: string;
    username: string;
    sales: number;
    commission: number;
  }>;
}

interface AnalyticsState {
  dateRange: 'day' | 'week' | 'month' | 'year';
  selectedMetrics: string[];
  viewMode: 'chart' | 'table';
  comparisonMode: boolean;
}

// React Query hooks
export const useAnalytics = (dateRange: string) => {
  return useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const { data } = await axios.get('/api/marketplace/analytics', {
        params: { dateRange }
      });
      return data as SalesMetrics;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

export const useRealtimeMetrics = () => {
  return useQuery({
    queryKey: ['realtime-metrics'],
    queryFn: async () => {
      const { data } = await axios.get('/api/marketplace/analytics/realtime');
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for realtime data
  });
};

// Redux slice for UI state
const marketplaceAnalyticsSlice = createSlice({
  name: 'marketplaceAnalytics',
  initialState: {
    dateRange: 'month' as const,
    selectedMetrics: ['sales', 'revenue', 'conversion'],
    viewMode: 'chart' as const,
    comparisonMode: false,
  } as AnalyticsState,
  reducers: {
    setDateRange: (state, action: PayloadAction<AnalyticsState['dateRange']>) => {
      state.dateRange = action.payload;
    },
    toggleMetric: (state, action: PayloadAction<string>) => {
      const index = state.selectedMetrics.indexOf(action.payload);
      if (index === -1) {
        state.selectedMetrics.push(action.payload);
      } else {
        state.selectedMetrics.splice(index, 1);
      }
    },
    setViewMode: (state, action: PayloadAction<AnalyticsState['viewMode']>) => {
      state.viewMode = action.payload;
    },
    toggleComparisonMode: (state) => {
      state.comparisonMode = !state.comparisonMode;
    },
  },
});

export const {
  setDateRange,
  toggleMetric,
  setViewMode,
  toggleComparisonMode,
} = marketplaceAnalyticsSlice.actions;

export default marketplaceAnalyticsSlice.reducer;

// Chart configuration helpers
export const getChartConfig = (metrics: SalesMetrics, selectedMetrics: string[]) => {
  return {
    data: {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      datasets: selectedMetrics.map(metric => ({
        label: metric,
        data: metrics[metric as keyof SalesMetrics],
        fill: false,
        tension: 0.4,
      })),
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          position: 'top' as const,
        },
      },
    },
  };
};

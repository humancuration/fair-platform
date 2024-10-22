import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
  metrics: SalesMetrics;
  loading: boolean;
  error: string | null;
  realtimeViewers: number;
  popularCategories: Array<{
    category: string;
    count: number;
  }>;
}

const initialState: AnalyticsState = {
  metrics: {
    daily: 0,
    weekly: 0,
    monthly: 0,
    total: 0,
    averageOrderValue: 0,
    topSellingProducts: [],
    conversionRate: 0,
    affiliatePerformance: [],
  },
  loading: false,
  error: null,
  realtimeViewers: 0,
  popularCategories: [],
};

export const fetchAnalytics = createAsyncThunk(
  'marketplaceAnalytics/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/marketplace/analytics');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const marketplaceAnalyticsSlice = createSlice({
  name: 'marketplaceAnalytics',
  initialState,
  reducers: {
    updateRealtimeViewers(state, action) {
      state.realtimeViewers = action.payload;
    },
    updatePopularCategories(state, action) {
      state.popularCategories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.metrics = action.payload;
        state.loading = false;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { updateRealtimeViewers, updatePopularCategories } = marketplaceAnalyticsSlice.actions;
export default marketplaceAnalyticsSlice.reducer;

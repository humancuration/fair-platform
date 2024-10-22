import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type?: 'background' | 'outfit' | 'accessory';
}

interface MarketplaceState {
  products: Product[];
  recommendations: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketplaceState = {
  products: [],
  recommendations: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'marketplace/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'marketplace/searchProducts',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to search products');
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'marketplace/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products/recommendations');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch recommendations');
    }
  }
);

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default marketplaceSlice.reducer;

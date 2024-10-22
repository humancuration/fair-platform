import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface BundleProduct {
  productId: string;
  quantity: number;
  discountPercentage: number;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  products: BundleProduct[];
  totalPrice: number;
  discountedPrice: number;
  validFrom: string;
  validUntil: string;
  limitedQuantity?: number;
  soldCount: number;
  imageUrl: string;
  featured: boolean;
}

interface BundlesState {
  bundles: Bundle[];
  loading: boolean;
  error: string | null;
}

const initialState: BundlesState = {
  bundles: [],
  loading: false,
  error: null,
};

export const fetchBundles = createAsyncThunk(
  'bundles/fetchBundles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/marketplace/bundles');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createBundle = createAsyncThunk(
  'bundles/createBundle',
  async (bundleData: Partial<Bundle>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/marketplace/bundles', bundleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const bundlesSlice = createSlice({
  name: 'bundles',
  initialState,
  reducers: {
    updateBundleStock(state, action) {
      const bundle = state.bundles.find(b => b.id === action.payload.bundleId);
      if (bundle) {
        bundle.soldCount = action.payload.soldCount;
      }
    },
    toggleBundleFeatured(state, action) {
      const bundle = state.bundles.find(b => b.id === action.payload);
      if (bundle) {
        bundle.featured = !bundle.featured;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBundles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBundles.fulfilled, (state, action) => {
        state.bundles = action.payload;
        state.loading = false;
      })
      .addCase(fetchBundles.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createBundle.fulfilled, (state, action) => {
        state.bundles.push(action.payload);
      });
  },
});

export const { updateBundleStock, toggleBundleFeatured } = bundlesSlice.actions;
export default bundlesSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FlashSaleProduct {
  productId: string;
  originalPrice: number;
  salePrice: number;
  quantity: number;
  soldCount: number;
}

interface FlashSale {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  products: FlashSaleProduct[];
  status: 'upcoming' | 'active' | 'ended';
  featured: boolean;
}

interface FlashSalesState {
  sales: FlashSale[];
  activeSale: FlashSale | null;
  loading: boolean;
  error: string | null;
}

const initialState: FlashSalesState = {
  sales: [],
  activeSale: null,
  loading: false,
  error: null,
};

export const fetchFlashSales = createAsyncThunk(
  'flashSales/fetchSales',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/marketplace/flash-sales');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createFlashSale = createAsyncThunk(
  'flashSales/createSale',
  async (saleData: Partial<FlashSale>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/marketplace/flash-sales', saleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const flashSalesSlice = createSlice({
  name: 'flashSales',
  initialState,
  reducers: {
    updateSaleStatus(state, action) {
      const sale = state.sales.find(s => s.id === action.payload.saleId);
      if (sale) {
        sale.status = action.payload.status;
      }
    },
    updateProductStock(state, action) {
      const sale = state.sales.find(s => s.id === action.payload.saleId);
      if (sale) {
        const product = sale.products.find(p => p.productId === action.payload.productId);
        if (product) {
          product.soldCount = action.payload.soldCount;
        }
      }
    },
    setActiveSale(state, action) {
      state.activeSale = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlashSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFlashSales.fulfilled, (state, action) => {
        state.sales = action.payload;
        state.loading = false;
      })
      .addCase(fetchFlashSales.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createFlashSale.fulfilled, (state, action) => {
        state.sales.push(action.payload);
      });
  },
});

export const { updateSaleStatus, updateProductStock, setActiveSale } = flashSalesSlice.actions;
export default flashSalesSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  amount: number;
  commission: number;
  affiliateId?: string;
  affiliateCommission?: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'marketplaceTransactions/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/marketplace/transactions');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  'marketplaceTransactions/create',
  async (transactionData: Partial<Transaction>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/marketplace/transactions', transactionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const marketplaceTransactionsSlice = createSlice({
  name: 'marketplaceTransactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      });
  },
});

export default marketplaceTransactionsSlice.reducer;

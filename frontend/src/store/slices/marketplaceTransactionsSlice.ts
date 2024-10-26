import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    discount?: number;
  }>;
}

interface TransactionsState {
  filters: {
    status: Transaction['status'] | 'all';
    dateRange: [Date | null, Date | null];
    searchQuery: string;
  };
  sortBy: {
    field: keyof Transaction;
    order: 'asc' | 'desc';
  };
  selectedTransactionId: string | null;
}

// React Query hooks
export const useTransactions = (filters: TransactionsState['filters']) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const { data } = await axios.get('/api/marketplace/transactions', {
        params: filters
      });
      return data as Transaction[];
    }
  });
};

export const useTransactionDetails = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/marketplace/transactions/${transactionId}`);
      return data as Transaction;
    },
    enabled: !!transactionId,
  });
};

export const useUpdateTransactionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      transactionId, 
      status 
    }: { 
      transactionId: string; 
      status: Transaction['status'];
    }) => {
      const { data } = await axios.patch(
        `/api/marketplace/transactions/${transactionId}`,
        { status }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transaction', variables.transactionId] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

// Redux slice for UI state
const marketplaceTransactionsSlice = createSlice({
  name: 'marketplaceTransactions',
  initialState: {
    filters: {
      status: 'all',
      dateRange: [null, null],
      searchQuery: '',
    },
    sortBy: {
      field: 'createdAt',
      order: 'desc',
    },
    selectedTransactionId: null,
  } as TransactionsState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TransactionsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<TransactionsState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSelectedTransaction: (state, action: PayloadAction<string | null>) => {
      state.selectedTransactionId = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        status: 'all',
        dateRange: [null, null],
        searchQuery: '',
      };
    },
  },
});

export const {
  setFilters,
  setSortBy,
  setSelectedTransaction,
  resetFilters,
} = marketplaceTransactionsSlice.actions;

export default marketplaceTransactionsSlice.reducer;

// Helper functions
export const formatTransactionAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getTransactionStatusColor = (status: Transaction['status']): string => {
  const colors = {
    pending: 'warning',
    completed: 'success',
    failed: 'error',
    refunded: 'info',
  };
  return colors[status];
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type?: 'background' | 'outfit' | 'accessory';
  stock: number;
  rating?: number;
  reviewCount?: number;
}

interface FilterState {
  category: string | null;
  priceRange: [number, number];
  sortBy: 'price' | 'rating' | 'newest' | null;
  searchQuery: string;
}

// React Query hooks
export const useProducts = (filters: Partial<FilterState>) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await axios.get('/api/products', { params: filters });
      return data as Product[];
    }
  });
};

export const useProductDetails = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      return data as Product;
    },
    enabled: !!productId
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id'>) => {
      const { data } = await axios.post('/api/products', productData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// Redux slice for UI state
const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState: {
    filters: {
      category: null,
      priceRange: [0, 1000],
      sortBy: null,
      searchQuery: '',
    } as FilterState,
    viewMode: 'grid' as 'grid' | 'list',
    selectedProductId: null as string | null,
  },
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<string | null>) => {
      state.selectedProductId = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        category: null,
        priceRange: [0, 1000],
        sortBy: null,
        searchQuery: '',
      };
    },
  },
});

export const {
  setFilters,
  setViewMode,
  setSelectedProduct,
  resetFilters,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;

// Framer Motion animations
export const productCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, transition: { duration: 0.2 } }
};

export const ProductCardAnimation = motion.div;

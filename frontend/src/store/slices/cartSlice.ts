import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  discount?: number;
  type?: 'background' | 'outfit' | 'accessory';
  sellerId?: string;
  affiliateId?: string;
  commissionRate?: number;
  stock: number;
}

// React Query hooks
export const useCartQuery = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await axios.get('/api/cart');
      return data;
    }
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<CartItem, 'quantity'>) => {
      const { data } = await axios.post('/api/cart/items', item);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      await axios.delete(`/api/cart/items/${itemId}`);
      return itemId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

// Redux slice for UI state
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    isCartOpen: false,
    checkoutStep: 0,
    selectedPaymentMethod: null as string | null,
  },
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCheckoutStep: (state, action: PayloadAction<number>) => {
      state.checkoutStep = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.selectedPaymentMethod = action.payload;
    },
  },
});

export const {
  toggleCart,
  setCheckoutStep,
  setPaymentMethod,
} = cartSlice.actions;

export default cartSlice.reducer;

// Framer Motion animations for cart items
export const cartItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const CartItemAnimation = motion.div;

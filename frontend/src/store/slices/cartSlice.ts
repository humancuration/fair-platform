import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
  checkoutStatus: 'idle' | 'processing' | 'success' | 'error';
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  checkoutStatus: 'idle',
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/cart');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async (item: Omit<CartItem, 'quantity'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/cart/items', item);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/cart/items/${itemId}`);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity <= item.stock) {
        item.quantity = action.payload.quantity;
        state.total = calculateTotal(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
      state.checkoutStatus = 'idle';
    },
    setCheckoutStatus(state, action: PayloadAction<CartState['checkoutStatus']>) {
      state.checkoutStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = calculateTotal(action.payload.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Item
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }
        state.total = calculateTotal(state.items);
        state.loading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove Item
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.total = calculateTotal(state.items);
      });
  },
});

// Helper function to calculate total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = item.discount 
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return total + (price * item.quantity);
  }, 0);
};

export const { updateQuantity, clearCart, setCheckoutStatus } = cartSlice.actions;
export default cartSlice.reducer;

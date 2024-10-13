import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistItem } from '@/types/wishlist';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    fetchWishlistStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWishlistSuccess(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchWishlistFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addWishlistItem(state, action: PayloadAction<WishlistItem>) {
      state.items.push(action.payload);
    },
    removeWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateWishlistItem(state, action: PayloadAction<WishlistItem>) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const {
  fetchWishlistStart,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  addWishlistItem,
  removeWishlistItem,
  updateWishlistItem,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

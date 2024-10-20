import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistItem } from '@/types/wishlist';

interface PublicWishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  username: string | null;
}

const initialState: PublicWishlistState = {
  items: [],
  loading: false,
  error: null,
  username: null,
};

const publicWishlistSlice = createSlice({
  name: 'publicWishlist',
  initialState,
  reducers: {
    fetchPublicWishlistStart(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.username = action.payload;
    },
    fetchPublicWishlistSuccess(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchPublicWishlistFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearPublicWishlist(state) {
      state.items = [];
      state.username = null;
    },
  },
});

export const {
  fetchPublicWishlistStart,
  fetchPublicWishlistSuccess,
  fetchPublicWishlistFailure,
  clearPublicWishlist,
} = publicWishlistSlice.actions;

export default publicWishlistSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityWishlistItem } from '@/types/wishlist';

interface CommunityWishlistState {
  items: CommunityWishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CommunityWishlistState = {
  items: [],
  loading: false,
  error: null,
};

const communityWishlistSlice = createSlice({
  name: 'communityWishlist',
  initialState,
  reducers: {
    fetchCommunityWishlistStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCommunityWishlistSuccess(state, action: PayloadAction<CommunityWishlistItem[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchCommunityWishlistFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addCommunityWishlistItem(state, action: PayloadAction<CommunityWishlistItem>) {
      state.items.push(action.payload);
    },
    updateCommunityWishlistItem(state, action: PayloadAction<CommunityWishlistItem>) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    contributeToCommunityWishlistItem(state, action: PayloadAction<{ id: string; amount: number }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.currentAmount += action.payload.amount;
      }
    },
  },
});

export const {
  fetchCommunityWishlistStart,
  fetchCommunityWishlistSuccess,
  fetchCommunityWishlistFailure,
  addCommunityWishlistItem,
  updateCommunityWishlistItem,
  contributeToCommunityWishlistItem,
} = communityWishlistSlice.actions;

export default communityWishlistSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WishlistService } from '@/api/services/wishlist.service';
import type { Product } from '@/types';

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchWishlistThunk = createAsyncThunk('wishlist/fetch', async () => {
  return WishlistService.getWishlist();
});

export const addToWishlistThunk = createAsyncThunk(
  'wishlist/add',
  async (productId: string) => {
    await WishlistService.addToWishlist(productId);
    return productId;
  },
);

export const removeFromWishlistThunk = createAsyncThunk(
  'wishlist/remove',
  async (productId: string) => {
    await WishlistService.removeFromWishlist(productId);
    return productId;
  },
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWishlistThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch wishlist';
      })
      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

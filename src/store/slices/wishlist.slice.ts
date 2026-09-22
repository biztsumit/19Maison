import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WishlistService } from '@/api/services/wishlist.service';
import type { Product } from '@/types';
import type { Wishlist } from '@/types/wishlist.types';

interface WishlistState {
  // Hydrated products, for the wishlist screen.
  items: Product[];
  // Membership set, read by every product card on every screen.
  ids: string[];
  // In-flight toggles, so a heart can be disabled mid-request.
  pendingIds: string[];
  count: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  ids: [],
  pendingIds: [],
  count: 0,
  isLoading: false,
  error: null,
};

export const fetchWishlistThunk = createAsyncThunk('wishlist/fetch', () =>
  WishlistService.getWishlist(),
);

// The API answers an add with the full updated wishlist, so the response replaces
// local state directly rather than being guessed at or refetched.
export const addToWishlistThunk = createAsyncThunk('wishlist/add', (productId: string) =>
  WishlistService.addToWishlist(productId),
);

export const removeFromWishlistThunk = createAsyncThunk(
  'wishlist/remove',
  async (productId: string) => {
    await WishlistService.removeFromWishlist(productId);
    return productId;
  },
);

export const clearWishlistThunk = createAsyncThunk('wishlist/clearAll', () =>
  WishlistService.clearWishlist(),
);

const applyWishlist = (state: WishlistState, payload: Wishlist) => {
  state.items = payload.items;
  state.ids = payload.items.map(p => p.id);
  state.count = payload.count;
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.ids = [];
      state.pendingIds = [];
      state.count = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWishlistThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        applyWishlist(state, action.payload);
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch wishlist';
      });

    // Add — optimistic on the membership set, reconciled from the server response.
    builder
      .addCase(addToWishlistThunk.pending, (state, action) => {
        const id = action.meta.arg;
        if (!state.ids.includes(id)) state.ids.push(id);
        state.pendingIds.push(id);
      })
      .addCase(addToWishlistThunk.fulfilled, (state, action) => {
        state.pendingIds = state.pendingIds.filter(id => id !== action.meta.arg);
        applyWishlist(state, action.payload);
      })
      .addCase(addToWishlistThunk.rejected, (state, action) => {
        const id = action.meta.arg;
        state.ids = state.ids.filter(existing => existing !== id);
        state.pendingIds = state.pendingIds.filter(existing => existing !== id);
      });

    // Remove — optimistic on both the membership set and the hydrated list.
    builder
      .addCase(removeFromWishlistThunk.pending, (state, action) => {
        const id = action.meta.arg;
        state.ids = state.ids.filter(existing => existing !== id);
        state.pendingIds.push(id);
      })
      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
        state.count = state.items.length;
        state.pendingIds = state.pendingIds.filter(id => id !== action.payload);
      })
      .addCase(removeFromWishlistThunk.rejected, (state, action) => {
        const id = action.meta.arg;
        if (!state.ids.includes(id)) state.ids.push(id);
        state.pendingIds = state.pendingIds.filter(existing => existing !== id);
      });

    // Clear all — the API returns no body, so state is emptied locally.
    builder
      .addCase(clearWishlistThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(clearWishlistThunk.fulfilled, state => {
        state.isLoading = false;
        state.items = [];
        state.ids = [];
        state.count = 0;
      })
      .addCase(clearWishlistThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to clear wishlist';
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

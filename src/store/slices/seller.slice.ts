import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SellerService } from '@/api/services/seller.service';
import type { SellerState } from '@/types';

const initialState: SellerState = {
  profile: null,
  analytics: null,
  inventory: [],
  isLoading: false,
  error: null,
};

export const fetchSellerProfileThunk = createAsyncThunk('seller/profile', async () => {
  return SellerService.getProfile();
});

export const fetchSellerAnalyticsThunk = createAsyncThunk(
  'seller/analytics',
  async (period?: 'week' | 'month' | 'year') => {
    return SellerService.getAnalytics(period);
  },
);

export const fetchInventoryThunk = createAsyncThunk('seller/inventory', async () => {
  return SellerService.getInventory();
});

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    clearSellerData(state) {
      state.profile = null;
      state.analytics = null;
      state.inventory = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSellerProfileThunk.pending, state => { state.isLoading = true; })
      .addCase(fetchSellerProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerAnalyticsThunk.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(fetchInventoryThunk.fulfilled, (state, action) => {
        state.inventory = action.payload;
      })
      .addMatcher(
        action => action.type.startsWith('seller/') && action.type.endsWith('/rejected'),
        (state, action: { error: { message?: string } }) => {
          state.isLoading = false;
          state.error = action.error.message ?? 'Failed';
        },
      );
  },
});

export const { clearSellerData } = sellerSlice.actions;
export default sellerSlice.reducer;

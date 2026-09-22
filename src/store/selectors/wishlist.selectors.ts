import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistIds = (state: RootState) => state.wishlist.ids;
export const selectWishlistPendingIds = (state: RootState) => state.wishlist.pendingIds;
export const selectWishlistLoading = (state: RootState) => state.wishlist.isLoading;
export const selectWishlistCount = (state: RootState) => state.wishlist.count;

// Memoised so every product card does not allocate a fresh Set per render.
export const selectWishlistIdSet = createSelector([selectWishlistIds], ids => new Set(ids));

export const selectWishlistPendingSet = createSelector(
  [selectWishlistPendingIds],
  ids => new Set(ids),
);

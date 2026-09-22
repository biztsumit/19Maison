import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectWishlistIdSet,
  selectWishlistPendingSet,
} from '@/store/selectors/wishlist.selectors';
import { addToWishlistThunk, removeFromWishlistThunk } from '@/store/slices/wishlist.slice';
import { haptics } from '@/utils/haptics';

// One hook behind every heart in the app, so screens never import the thunks
// and the membership set stays consistent across Home, Explore, PDP and Wishlist.
export function useWishlistToggle() {
  const dispatch = useAppDispatch();
  const ids = useAppSelector(selectWishlistIdSet);
  const pending = useAppSelector(selectWishlistPendingSet);

  const isWishlisted = useCallback((productId: string) => ids.has(productId), [ids]);
  const isPending = useCallback((productId: string) => pending.has(productId), [pending]);

  const toggle = useCallback(
    (productId: string) => {
      if (pending.has(productId)) return;
      haptics.select();
      // Dispatched separately: the two thunks resolve to different payload types,
      // so a ternary inside dispatch() widens to an un-dispatchable union.
      if (ids.has(productId)) {
        dispatch(removeFromWishlistThunk(productId));
      } else {
        dispatch(addToWishlistThunk(productId));
      }
    },
    [dispatch, ids, pending],
  );

  return { isWishlisted, isPending, toggle };
}

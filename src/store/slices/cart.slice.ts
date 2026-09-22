import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartService } from '@/api/services/cart.service';
import type { CartState, AddToCartRequest } from '@/types';

// ── Thunks ────────────────────────────────────────────────────────────────

export const fetchCartThunk = createAsyncThunk('cart/fetch', () => CartService.getCart());

export const addToCartThunk = createAsyncThunk('cart/add', (data: AddToCartRequest) =>
  CartService.addItem(data),
);

export const updateCartItemThunk = createAsyncThunk(
  'cart/update',
  (arg: { cartItemId: string; quantity: number }) => CartService.updateItem(arg),
);

export const removeCartItemThunk = createAsyncThunk('cart/remove', (cartItemId: string) =>
  CartService.removeItem(cartItemId),
);

export const applyCouponThunk = createAsyncThunk('cart/coupon', (code: string) =>
  CartService.applyCoupon({ code }),
);

export const removeCouponThunk = createAsyncThunk('cart/removeCoupon', () =>
  CartService.removeCoupon(),
);

// Empties the cart server-side after an order is placed. Unlike the thunks above
// this resolves to void, so it gets its own reducer case rather than joining the
// shared setCart handler.
export const clearCartThunk = createAsyncThunk('cart/clear', () => CartService.clearCart());

// ── Slice ──────────────────────────────────────────────────────────────────

const initialState: CartState = {
  cart: null,
  itemCount: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.cart = null;
      state.itemCount = 0;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    const setLoading = (state: CartState) => {
      state.isLoading = true;
      state.error = null;
    };
    const setCart = (state: CartState, action: { payload: CartState['cart'] }) => {
      state.isLoading = false;
      state.cart = action.payload;
      state.itemCount = action.payload?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
    };
    const setError = (state: CartState, action: { error: { message?: string } }) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Cart operation failed';
    };

    (
      [
        fetchCartThunk,
        addToCartThunk,
        updateCartItemThunk,
        removeCartItemThunk,
        applyCouponThunk,
        removeCouponThunk,
      ] as const
    ).forEach(thunk => {
      builder
        .addCase(thunk.pending, setLoading)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .addCase(thunk.fulfilled as any, setCart)
        .addCase(thunk.rejected, setError);
    });

    builder
      .addCase(clearCartThunk.pending, setLoading)
      .addCase(clearCartThunk.fulfilled, state => {
        state.isLoading = false;
        state.cart = null;
        state.itemCount = 0;
      })
      .addCase(clearCartThunk.rejected, setError);
  },
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;

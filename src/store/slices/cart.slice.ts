import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartService, GuestTokenManager } from '@/api/services/cart.service';
import type { CartState, AddToCartRequest } from '@/types';

// ── Thunk argument types ──────────────────────────────────────────────────

interface AuthFlag { isAuthenticated: boolean }
interface AddArg extends AuthFlag { data: AddToCartRequest }
interface UpdateArg extends AuthFlag { cartItemId: string; quantity: number }
interface RemoveArg extends AuthFlag { cartItemId: string }

// ── Thunks ────────────────────────────────────────────────────────────────

export const fetchCartThunk = createAsyncThunk(
  'cart/fetch',
  async ({ isAuthenticated }: AuthFlag) => {
    if (isAuthenticated) return CartService.getCart();
    const token = await GuestTokenManager.getOrCreateToken();
    return CartService.getGuestCart(token);
  },
);

export const addToCartThunk = createAsyncThunk(
  'cart/add',
  async ({ isAuthenticated, data }: AddArg) => {
    if (isAuthenticated) return CartService.addItem(data);
    const token = await GuestTokenManager.getOrCreateToken();
    return CartService.addGuestItem(token, data);
  },
);

export const updateCartItemThunk = createAsyncThunk(
  'cart/update',
  async ({ isAuthenticated, cartItemId, quantity }: UpdateArg) => {
    if (isAuthenticated) return CartService.updateItem({ cartItemId, quantity });
    const token = await GuestTokenManager.getOrCreateToken();
    return CartService.updateGuestItem(token, cartItemId, quantity);
  },
);

export const removeCartItemThunk = createAsyncThunk(
  'cart/remove',
  async ({ isAuthenticated, cartItemId }: RemoveArg) => {
    if (isAuthenticated) return CartService.removeItem(cartItemId);
    const token = await GuestTokenManager.getOrCreateToken();
    return CartService.removeGuestItem(token, cartItemId);
  },
);

export const applyCouponThunk = createAsyncThunk(
  'cart/coupon',
  async (code: string) => CartService.applyCoupon({ code }),
);

export const removeCouponThunk = createAsyncThunk(
  'cart/removeCoupon',
  async () => CartService.removeCoupon(),
);

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
  },
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/auth.slice';
import cartReducer from './slices/cart.slice';
import wishlistReducer from './slices/wishlist.slice';
import productReducer from './slices/product.slice';
import notificationReducer from './slices/notification.slice';
import sellerReducer from './slices/seller.slice';
import { loggerMiddleware } from './middleware/logger.middleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    notifications: notificationReducer,
    seller: sellerReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/restoreSession/fulfilled'],
      },
    }).concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

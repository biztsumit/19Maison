import type { Middleware } from '@reduxjs/toolkit';
import { ENV } from '@/config/env';

export const loggerMiddleware: Middleware = store => next => action => {
  if (!ENV.IS_DEV) return next(action);
  if (typeof action === 'object' && action !== null && 'type' in action) {
    console.warn('[Redux]', (action as { type: string }).type, store.getState());
  }
  return next(action);
};

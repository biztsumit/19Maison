import { ENV } from '@/config/env';

export const API_BASE_URL = ENV.API_URL;
export const API_TIMEOUT = 15000;

export const Endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    staffLogin: '/auth/staff-login',
    register: '/auth/register',
    verifyOtp: '/auth/verify-otp',
    resendOtp: '/auth/resend-otp',
    google: '/auth/google',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    me: '/auth/me',
  },
  // Homepage CMS
  homepage: '/homepage',
  // Customer
  products: {
    list: '/products',
    filters: '/products/filters',
    latestDrop: '/products/latest-drop',
    detail: (id: string) => `/products/${id}`,
    reviews: (id: string) => `/products/${id}/reviews`,
    addReview: (id: string) => `/products/${id}/reviews`,
    featured: '/products/featured',
    latest: '/products/latest',
    collectorsEdition: '/products/collectors',
  },
  brands: {
    list: '/brands',
    detail: (slug: string) => `/brands/${slug}`,
  },
  cart: {
    // Authenticated cart
    get: '/cart',
    add: '/cart/items',
    update: (itemId: string) => `/cart/items/${itemId}`,
    remove: (itemId: string) => `/cart/items/${itemId}`,
    clear: '/cart/clear',
    coupon: '/cart/coupon',
    // Guest cart
    guestCreate: '/cart/guest',
    guestGet: '/cart/guest',
    guestAdd: '/cart/guest/items',
    guestUpdate: (itemId: string) => `/cart/guest/items/${itemId}`,
    guestRemove: (itemId: string) => `/cart/guest/items/${itemId}`,
    guestMerge: '/cart/guest/merge',
  },
  // Navigation (for Category tab)
  navigation: '/navigation',
  wishlist: {
    get: '/wishlist',
    add: '/wishlist',
    remove: (productId: string) => `/wishlist/${productId}`,
    check: (productId: string) => `/wishlist/check/${productId}`,
  },
  orders: {
    list: '/orders',
    create: '/orders',
    detail: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  payments: {
    initiate: '/payments/initiate',
    verify: '/payments/verify',
  },
  profile: {
    get: '/profile',
    update: '/profile',
    uploadAvatar: '/profile/avatar',
    addresses: '/profile/addresses',
    addAddress: '/profile/addresses',
    updateAddress: (id: string) => `/profile/addresses/${id}`,
    deleteAddress: (id: string) => `/profile/addresses/${id}`,
  },
  notifications: {
    list: '/notifications',
    read: (id: string) => `/notifications/${id}/read`,
    readAll: '/notifications/read-all',
    registerToken: '/notifications/token',
  },
  // Seller
  seller: {
    profile: '/seller/profile',
    updateProfile: '/seller/profile',
    uploadBanner: '/seller/banner',
    analytics: '/seller/analytics',
    earnings: '/seller/earnings',
    products: {
      list: '/seller/products',
      create: '/seller/products',
      detail: (id: string) => `/seller/products/${id}`,
      update: (id: string) => `/seller/products/${id}`,
      delete: (id: string) => `/seller/products/${id}`,
      uploadImages: (id: string) => `/seller/products/${id}/images`,
    },
    orders: {
      list: '/seller/orders',
      detail: (id: string) => `/seller/orders/${id}`,
      updateStatus: (id: string) => `/seller/orders/${id}/status`,
    },
    inventory: {
      list: '/seller/inventory',
      update: (variantId: string) => `/seller/inventory/${variantId}`,
    },
  },
} as const;

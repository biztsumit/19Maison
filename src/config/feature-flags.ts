import { ENV } from './env';

export const FeatureFlags = {
  enableWishlist: true,
  enableCoupons: true,
  enableReviews: true,
  enablePushNotifications: true,
  enableAnalytics: ENV.IS_PROD,
  enableCrashReporting: ENV.IS_PROD,
  enableOTAUpdates: !ENV.IS_DEV,
  enableCollectorsEdition: true,
  enableSellerAnalytics: true,
} as const;

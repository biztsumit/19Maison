export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  STRIPE_KEY: process.env.EXPO_PUBLIC_STRIPE_KEY ?? '',
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  ANALYTICS_KEY: process.env.EXPO_PUBLIC_ANALYTICS_KEY ?? '',
  IS_DEV: process.env.EXPO_PUBLIC_APP_ENV === 'development',
  IS_PROD: process.env.EXPO_PUBLIC_APP_ENV === 'production',
} as const;

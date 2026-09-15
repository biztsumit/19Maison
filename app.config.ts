import type { ExpoConfig, ConfigContext } from 'expo/config';

const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
const IS_PROD = APP_ENV === 'production';
const IS_QA = APP_ENV === 'qa';

// Android package names cannot start a segment with a digit → use "maison19" not "19maison"
const bundleId = IS_PROD
  ? 'com.maison19.app'
  : IS_QA
    ? 'com.maison19.qa'
    : 'com.maison19.dev';

const appName = IS_PROD ? '19Maison' : IS_QA ? '19Maison QA' : '19Maison Dev';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: 'maison19',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'maison19',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: bundleId,
    supportsTablet: false,
    infoPlist: {
      NSCameraUsageDescription: 'Used to upload product photos.',
      NSPhotoLibraryUsageDescription: 'Used to select product images.',
      NSUserNotificationsUsageDescription: 'Receive order and promotion updates.',
    },
  },
  android: {
    package: bundleId,
    minSdkVersion: 24,
    adaptiveIcon: {
      backgroundColor: '#0A0A0A',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
    ],
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        icon: './assets/images/icon.png',
        color: '#C9A84C',
        sounds: [],
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0A0A0A',
        android: {
          image: './assets/images/splash-icon.png',
          imageWidth: 120,
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Used to select product images.',
        cameraPermission: 'Used to take product photos.',
      },
    ],
    'expo-updates',
  ],
  updates: {
    url: `https://u.expo.dev/${IS_PROD ? 'prod' : IS_QA ? 'qa' : 'dev'}`,
    enabled: IS_PROD || IS_QA,
    checkAutomatically: 'ON_LOAD',
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  extra: {
    eas: {
      projectId: 'your-eas-project-id',
    },
    appEnv: APP_ENV,
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});

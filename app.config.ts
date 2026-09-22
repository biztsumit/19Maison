import type { ConfigContext, ExpoConfig } from 'expo/config';

// The EAS project UUID, printed by `eas init`. A dynamic config cannot be written
// to automatically, so paste it here — it drives both extra.eas.projectId and the
// EAS Update URL, which must be https://u.expo.dev/<this uuid>.
const EAS_PROJECT_ID = 'ef071996-f154-4cc1-9fba-f6b14b141013';

const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
const IS_PROD = APP_ENV === 'production';
const IS_QA = APP_ENV === 'qa';

// Android package names cannot start a segment with a digit → use "maison19" not "19maison"
const bundleId = IS_PROD ? 'com.maison19.app' : IS_QA ? 'com.maison19.qa' : 'com.maison19.dev';

const appName = IS_PROD ? '19Maison' : IS_QA ? '19Maison QA' : '19Maison Dev';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: 'maison19',
  // The EAS account that owns the project referenced by EAS_PROJECT_ID.
  owner: 'biztecno',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'maison19',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/images/icon.png',
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
    adaptiveIcon: {
      backgroundColor: '#000000',
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
    [
      'expo-build-properties',
      {
        android: {
          // Both API environments are served over plain http, which Android has
          // blocked by default since API 28. Without this every request in a
          // release build fails with CLEARTEXT_NOT_PERMITTED.
          usesCleartextTraffic: true,
        },
      },
    ],
    'expo-router',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        // Android masks this to a silhouette via its alpha channel, so it must be
        // the transparent monochrome mark, not the full-colour icon.
        icon: './assets/images/android-icon-monochrome.png',
        color: '#D4AF37',
        sounds: [],
      },
    ],
    [
      'expo-splash-screen',
      {
        // Figma splash frame is pure #000000, not the #0A0A0A dark-surface token.
        backgroundColor: '#000000',
        // iOS applies no mask, so it gets the tight lockup at the design's width.
        image: './assets/images/splash-icon.png',
        // The wordmark occupies ~68% of the 428pt design frame.
        imageWidth: 260,
        resizeMode: 'contain',
        android: {
          // Android 12+ masks the splash icon to a circle, which cropped the 7.3:1
          // lockup down to its middle letters. This asset is the same wordmark
          // centred on a 1024 square at a width that fits inside the mask.
          image: './assets/images/splash-icon-android.png',
          imageWidth: 288,
          resizeMode: 'contain',
          backgroundColor: '#000000',
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
    // One project = one URL. Environments are separated by the `channel` set per
    // build profile in eas.json, not by the URL.
    url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    enabled: IS_PROD || IS_QA,
    checkAutomatically: 'ON_LOAD',
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  extra: {
    eas: {
      projectId: EAS_PROJECT_ID,
    },
    appEnv: APP_ENV,
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});

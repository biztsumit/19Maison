import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Thin wrapper so call sites never deal with platform checks or rejected promises.
// Haptics are unsupported on web and can reject on devices without a vibrator, and
// a failed buzz must never break the action it was decorating.
const safe = (run: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  run().catch(() => {});
};

export const haptics = {
  // A basket or wishlist change landed.
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  // Discrete UI steps: quantity stepper, filter chips, tab changes.
  tap: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  select: () => safe(() => Haptics.selectionAsync()),
};

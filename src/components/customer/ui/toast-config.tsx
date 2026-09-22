import { StyleSheet, View } from 'react-native';
import type { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { CustomerColors } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Text } from './Text';

type Tone = 'success' | 'error' | 'info';

const TONES: Record<Tone, { icon: IconName; color: string }> = {
  success: { icon: 'check', color: CustomerColors.success },
  error: { icon: 'alert', color: CustomerColors.error },
  info: { icon: 'alert', color: CustomerColors.accent },
};

// Dark card with a coloured accent rail, rather than the library's stock green and
// red banners — those were the one piece of unthemed chrome left in the customer
// flow. Dark on a light app reads as system feedback rather than page content.
function ToastCard({ tone, text1, text2 }: { tone: Tone } & ToastConfigParams<unknown>) {
  const { icon, color } = TONES[tone];

  return (
    <View style={styles.card}>
      <View style={[styles.rail, { backgroundColor: color }]} />
      <Icon name={icon} size={18} color={color} />
      <View style={styles.body}>
        {Boolean(text1) && (
          <Text variant="bodySmall" tone="inverse" numberOfLines={2}>
            {text1}
          </Text>
        )}
        {Boolean(text2) && (
          <Text variant="caption" tone="inverseMuted" numberOfLines={3}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: props => <ToastCard tone="success" {...props} />,
  error: props => <ToastCard tone="error" {...props} />,
  info: props => <ToastCard tone="info" {...props} />,
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    width: '92%',
    minHeight: 56,
    paddingVertical: Spacing[3],
    paddingRight: Spacing[4],
    paddingLeft: Spacing[4] + 3,
    backgroundColor: CustomerColors.bgDark,
    overflow: 'hidden',
  },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  body: { flex: 1, gap: 2 },
});

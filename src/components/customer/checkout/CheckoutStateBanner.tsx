import { Pressable, StyleSheet, View } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { CheckoutState } from '@/hooks/useCheckout';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';

interface Props {
  state: CheckoutState;
  onDismiss: () => void;
}

export function CheckoutStateBanner({ state, onDismiss }: Props) {
  if (state.status === 'failed') {
    return (
      <View style={[styles.banner, styles.error]}>
        <Text variant="bodySmall" style={styles.flex}>
          {state.error}
        </Text>
        <Pressable onPress={onDismiss} hitSlop={8} accessibilityLabel="Dismiss error">
          <Icon name="close" size={18} color={CustomerColors.text} />
        </Pressable>
      </View>
    );
  }

  if (state.status === 'dismissed') {
    return (
      <View style={[styles.banner, styles.info]}>
        <View style={styles.flex}>
          {/* Without the reason this said "payment was not completed" even when the
              sheet never opened, which read as though the user had cancelled. */}
          {state.reason ? (
            <Text variant="bodySmall">{state.reason}</Text>
          ) : (
            <Text variant="bodySmall">Payment was not completed.</Text>
          )}
          <Text variant="caption">
            Your order is still reserved, so trying again will not create a duplicate.
          </Text>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    padding: Spacing[4],
  },
  error: { backgroundColor: CustomerColors.accentMuted },
  info: { backgroundColor: CustomerColors.bgAlt },
  flex: { flex: 1 },
});

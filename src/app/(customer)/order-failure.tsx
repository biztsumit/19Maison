import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, CustomerHeader, CustomerScreen, Icon, Text } from '@/components/customer';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';

// Reached only when Razorpay reported success but verification failed, so the
// money may already be captured. Deliberately offers no plain retry.
export default function OrderFailureScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  return (
    <CustomerScreen header={<CustomerHeader variant="title" title="Payment" />} scroll={false}>
      <View style={styles.wrap}>
        <View style={styles.iconRing}>
          <Icon name="alert" size={30} color={CustomerColors.error} />
        </View>

        <Text variant="screenTitle" style={styles.center}>
          Payment not confirmed
        </Text>
        <Text variant="bodyMuted" style={styles.center}>
          We could not verify this payment. If you were charged, the amount is reconciled
          automatically and refunded within 5 to 7 working days.
        </Text>

        {Boolean(orderId) && (
          <Text variant="caption" style={styles.center}>
            Reference: {orderId}
          </Text>
        )}

        <View style={styles.actions}>
          {Boolean(orderId) && (
            <Button
              label="View order"
              variant="solid"
              onPress={() => router.replace(`/(customer)/order/${orderId}`)}
              fullWidth
            />
          )}
          <Button
            label="Contact support"
            variant="outline"
            onPress={() => router.replace('/(customer)/contact')}
            fullWidth
          />
        </View>
      </View>
    </CustomerScreen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    paddingHorizontal: CustomerLayout.screenPaddingH,
  },
  center: { textAlign: 'center' },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: CustomerColors.bgAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { alignSelf: 'stretch', gap: Spacing[3], marginTop: Spacing[4] },
});

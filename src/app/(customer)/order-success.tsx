import { useEffect, useRef } from 'react';
import { CUSTOMER_HOME } from '@/constants/routes';
import { Animated, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Button,
  CopyButton,
  CustomerScreen,
  Divider,
  Icon,
  PriceRow,
  Skeleton,
  Text,
} from '@/components/customer';
import { OrderLineItem, orderItemToLine } from '@/components/customer/checkout/OrderLineItem';
import { useOrder } from '@/hooks/useOrders';
import { CustomerLayout } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { formatOrderNumber } from '@/utils/formatters';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

export default function OrderSuccessScreen() {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const { orderId, method } = useLocalSearchParams<{ orderId: string; method?: string }>();
  // Params carry only what the create call returned, which is empty when a
  // reserved order is resumed. The order itself is the source of truth.
  const { data: order, isLoading } = useOrder(orderId);

  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }).start();
  }, [scale]);

  const isCod = method === 'COD';

  return (
    <CustomerScreen contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Animated.View style={[styles.check, { transform: [{ scale }] }]}>
          <Icon name="check" size={34} color={colors.accent} strokeWidth={3} />
        </Animated.View>

        <Text variant="screenTitle" style={styles.center}>
          Thank you
        </Text>
        <Text variant="bodyMuted" style={styles.center}>
          {isCod
            ? 'Your order is confirmed. Pay when it arrives.'
            : 'Your payment is confirmed and your order is being prepared.'}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text variant="sectionHeading">Order details</Text>
          {order?.orderNumber && (
            <CopyButton value={order.orderNumber} label={formatOrderNumber(order.orderNumber)} />
          )}
        </View>

        {isLoading ? (
          <View style={styles.list}>
            <Skeleton height={72} />
            <Skeleton height={72} />
          </View>
        ) : order ? (
          <>
            <View style={styles.list}>
              {order.items?.map(item => (
                <OrderLineItem key={item.id} line={orderItemToLine(item)} />
              ))}
            </View>

            <Divider />

            <PriceRow label="Sub total" value={order.subtotal} />
            {order.discount > 0 && <PriceRow label="Discount" value={-order.discount} />}
            {order.tax > 0 && <PriceRow label="Tax" value={order.tax} />}
            {order.shipping > 0 && <PriceRow label="Shipping" value={order.shipping} />}
            <PriceRow label="Total" value={order.total} emphasis="total" />
          </>
        ) : (
          <Text variant="bodyMuted">We could not load the order details right now.</Text>
        )}
      </View>

      <View style={styles.actions}>
        {Boolean(orderId) && (
          <Button
            label="Track order"
            variant="outline"
            onPress={() => router.replace(`/(customer)/order/${orderId}`)}
            fullWidth
          />
        )}
        <Button
          label="Continue shopping"
          variant="solid"
          onPress={() => router.replace(CUSTOMER_HOME)}
          fullWidth
        />
      </View>
    </CustomerScreen>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    content: { padding: CustomerLayout.screenPaddingH, gap: Spacing[6] },
    hero: { alignItems: 'center', gap: Spacing[3], paddingTop: Spacing[10] },
    check: {
      width: 84,
      height: 84,
      borderRadius: BorderRadius.full,
      backgroundColor: c.bgDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    center: { textAlign: 'center' },
    card: {
      gap: Spacing[4],
      padding: Spacing[4],
      borderWidth: 1,
      borderColor: c.border,
    },
    cardHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing[3],
    },
    list: { gap: Spacing[4] },
    actions: { gap: Spacing[3] },
  });

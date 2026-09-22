import { Linking, StyleSheet, View } from 'react-native';
import { useConfirm } from '@/providers/ConfirmProvider';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  Button,
  CopyButton,
  CustomerHeader,
  CustomerScreen,
  Divider,
  ErrorView,
  PriceRow,
  Skeleton,
  StatusBadge,
  Text,
} from '@/components/customer';
import { OrderLineItem, orderItemToLine } from '@/components/customer/checkout/OrderLineItem';
import { useCancelOrder, useOrder } from '@/hooks/useOrders';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { formatDate, formatOrderNumber } from '@/utils/formatters';
import { canCancel, canTrack, orderStatusLabel, orderStatusTone } from '@/utils/order-status';
import { formatPhone } from '@/utils/phone';

export default function OrderDetailScreen() {
  const confirm = useConfirm();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, error, refetch } = useOrder(id);
  const cancelOrder = useCancelOrder();

  const header = <CustomerHeader variant="back" title="Order details" />;

  if (isLoading) {
    return (
      <CustomerScreen header={header} contentContainerStyle={styles.content}>
        <Skeleton height={28} width="60%" />
        <Skeleton height={96} />
        <Skeleton height={96} />
      </CustomerScreen>
    );
  }

  if (isError || !order) {
    return (
      <CustomerScreen header={header} scroll={false}>
        <ErrorView
          title="Order not found"
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
          onBack={() => router.back()}
        />
      </CustomerScreen>
    );
  }

  const address = order.shippingAddress;
  const trackable = canTrack(order.status) && (order.trackingUrl || order.trackingNumber);

  const confirmCancel = async () => {
    const ok = await confirm({
      title: 'Cancel order',
      message: 'Are you sure you want to cancel this order?',
      confirmLabel: 'Cancel order',
      cancelLabel: 'Keep order',
      destructive: true,
    });
    if (!ok) return;
    try {
      await cancelOrder.mutateAsync(order.id);
      Toast.show({ type: 'success', text1: 'Order cancelled' });
    } catch {
      Toast.show({ type: 'error', text1: 'Could not cancel order' });
    }
  };

  return (
    <CustomerScreen header={header} contentContainerStyle={styles.content}>
      <View style={styles.headRow}>
        <View style={styles.headText}>
          <StatusBadge
            label={orderStatusLabel(order.status)}
            tone={orderStatusTone(order.status)}
          />
          {Boolean(order.createdAt) && (
            <Text variant="caption">Placed {formatDate(order.createdAt as string)}</Text>
          )}
        </View>
        <CopyButton value={order.orderNumber} label={formatOrderNumber(order.orderNumber)} />
      </View>

      <Divider />

      <Text variant="sectionHeading">Items</Text>
      <View style={styles.list}>
        {order.items?.map(item => (
          <OrderLineItem key={item.id} line={orderItemToLine(item)} />
        ))}
      </View>

      {address && (
        <>
          <Divider />
          <Text variant="sectionHeading">Delivery address</Text>
          <View>
            {Boolean(order.customerName) && (
              <Text variant="bodySmallMuted">{order.customerName}</Text>
            )}
            <Text variant="bodySmallMuted">
              {[address.address, address.apartment].filter(Boolean).join(', ')}
            </Text>
            <Text variant="bodySmallMuted">
              {[address.city, address.state].filter(Boolean).join(', ')} {address.pincode}
            </Text>
            <Text variant="bodySmallMuted">{address.country}</Text>
            <Text variant="bodySmallMuted">{formatPhone(address.phone)}</Text>
          </View>
        </>
      )}

      <Divider />

      <Text variant="sectionHeading">Price details</Text>
      <View>
        <PriceRow label="Sub total" value={order.subtotal} />
        {order.discount > 0 && <PriceRow label="Discount" value={-order.discount} />}
        {order.tax > 0 && <PriceRow label="Tax" value={order.tax} />}
        {order.shipping > 0 && <PriceRow label="Shipping" value={order.shipping} />}
        <Divider />
        <PriceRow label="Total" value={order.total} emphasis="total" />
      </View>

      <View style={styles.actions}>
        {trackable && (
          <Button
            label="Track order"
            variant="outline"
            fullWidth
            onPress={() =>
              order.trackingUrl
                ? Linking.openURL(order.trackingUrl)
                : void confirm({
                    title: 'Tracking number',
                    message: order.trackingNumber as string,
                    variant: 'alert',
                  })
            }
          />
        )}
        {canCancel(order.status) && (
          <Button
            label="Cancel order"
            variant="outline"
            fullWidth
            loading={cancelOrder.isPending}
            onPress={confirmCancel}
          />
        )}
      </View>
    </CustomerScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing[4],
    padding: CustomerLayout.screenPaddingH,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing[3],
  },
  headText: { gap: Spacing[1] },
  list: { gap: Spacing[4] },
  actions: { gap: Spacing[3], marginTop: Spacing[2] },
});

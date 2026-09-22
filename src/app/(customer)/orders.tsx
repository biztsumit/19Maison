import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { useConfirm } from '@/providers/ConfirmProvider';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import {
  CustomerHeader,
  CustomerScreen,
  Divider,
  EmptyState,
  ErrorView,
  Skeleton,
  Text,
} from '@/components/customer';
import { OrderCard } from '@/components/customer/account/OrderCard';
import { useCancelOrder, useOrders } from '@/hooks/useOrders';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { Order } from '@/types/order.types';
import { canCancel, canTrack } from '@/utils/order-status';

export default function OrdersScreen() {
  const confirm = useConfirm();
  const { data, isLoading, isError, error, refetch, isRefetching } = useOrders();
  const cancelOrder = useCancelOrder();

  const orders = data?.orders ?? [];
  const header = <CustomerHeader variant="back" title="Orders" />;

  const confirmCancel = async (order: Order) => {
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

  const handleTrack = (order: Order) => {
    if (order.trackingUrl) {
      Linking.openURL(order.trackingUrl);
    } else if (order.trackingNumber) {
      void confirm({
        title: 'Tracking number',
        message: order.trackingNumber,
        variant: 'alert',
      });
    }
  };

  if (isLoading) {
    return (
      <CustomerScreen header={header} contentContainerStyle={styles.content}>
        <Skeleton height={150} />
        <Skeleton height={150} />
        <Skeleton height={150} />
      </CustomerScreen>
    );
  }

  if (isError) {
    return (
      <CustomerScreen header={header} scroll={false}>
        <ErrorView
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      </CustomerScreen>
    );
  }

  if (orders.length === 0) {
    return (
      <CustomerScreen header={header} scroll={false}>
        <EmptyState
          icon="bag"
          title="No orders yet"
          message="When you place an order it will appear here."
          actionLabel="Start shopping"
          onAction={() => router.push('/(customer)/(tabs)/explore')}
        />
      </CustomerScreen>
    );
  }

  return (
    <CustomerScreen
      header={header}
      refreshing={isRefetching}
      onRefresh={refetch}
      contentContainerStyle={styles.content}
    >
      {orders.map(order => {
        // Track is only offered when the carrier actually gave us something to show.
        const trackable = canTrack(order.status) && (order.trackingUrl || order.trackingNumber);
        const cancellable = canCancel(order.status);
        const hasActions = trackable || cancellable;

        return (
          <OrderCard
            key={order.id}
            order={order}
            onPress={o => router.push(`/(customer)/order/${o.id}`)}
            footer={
              hasActions ? (
                <>
                  <Divider />
                  <View style={styles.actions}>
                    {trackable && (
                      <Pressable onPress={() => handleTrack(order)} hitSlop={6}>
                        <Text variant="link">Track order</Text>
                      </Pressable>
                    )}
                    {cancellable && (
                      <Pressable onPress={() => confirmCancel(order)} hitSlop={6}>
                        <Text variant="link">Cancel order</Text>
                      </Pressable>
                    )}
                  </View>
                </>
              ) : null
            }
          />
        );
      })}
    </CustomerScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing[4],
    padding: CustomerLayout.screenPaddingH,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[5],
    padding: Spacing[4],
  },
});

import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Divider } from '@/components/common/Divider';
import { Input } from '@/components/common/Input';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { SellerService } from '@/api/services/seller.service';
import { formatPrice, formatDate, formatOrderNumber } from '@/utils/formatters';
import type { OrderStatus } from '@/types';

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'processing',
  processing: 'shipped',
  shipped: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: Colors.warning,
  RESERVED: Colors.info,
  PAID: Colors.info,
  PROCESSING: Colors.info,
  SHIPPED: Colors.gold,
  DELIVERED: Colors.success,
  CANCELLED: Colors.error,
  RETURNED: Colors.amber,
  REFUNDED: Colors.textMuted,
  pending: Colors.warning,
  confirmed: Colors.info,
  processing: Colors.info,
  shipped: Colors.gold,
  out_for_delivery: Colors.amber,
  delivered: Colors.success,
  cancelled: Colors.error,
  refunded: Colors.textMuted,
};

export default function SellerOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [trackingNumber, setTrackingNumber] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['seller-order', id],
    queryFn: () => SellerService.getOrders().then(r => r.data.find(o => o.id === id)!),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) =>
      SellerService.updateOrderStatus(id, {
        status,
        trackingNumber: trackingNumber || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-order', id] });
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
      Toast.show({ type: 'success', text1: 'Order status updated' });
    },
    onError: () => Toast.show({ type: 'error', text1: 'Failed to update status' }),
  });

  const nextStatus = order ? NEXT_STATUS[order.status] : undefined;

  const handleStatusUpdate = () => {
    if (!nextStatus) return;
    Alert.alert('Update Status', `Mark order as "${nextStatus.replace(/_/g, ' ')}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => statusMutation.mutate(nextStatus) },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text color="muted">← Back</Text>
            </TouchableOpacity>
            <Text variant="label" style={styles.headerTitle}>
              ORDER
            </Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.content}>
            <Skeleton height={16} width="50%" />
            <Skeleton height={80} />
            <Skeleton height={120} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!order) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text color="muted">← Back</Text>
          </TouchableOpacity>
          <Text variant="label" style={styles.headerTitle}>
            ORDER DETAIL
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Order Info */}
          <View style={styles.orderMeta}>
            <View style={styles.orderMetaLeft}>
              <Text variant="headingSmall" color="gold">
                {formatOrderNumber(order.orderNumber)}
              </Text>
              <Text variant="bodySmall" color="muted">
                {order.createdAt ? formatDate(order.createdAt) : ''}
              </Text>
            </View>
            <View style={[styles.statusBadge, { borderColor: STATUS_COLOR[order.status] }]}>
              <Text variant="label" style={{ color: STATUS_COLOR[order.status], letterSpacing: 1 }}>
                {order.status.replace(/_/g, ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          <Divider />

          {/* Customer */}
          <View style={styles.section}>
            <Text variant="label" color="secondary" style={styles.sectionTitle}>
              CUSTOMER
            </Text>
            <View style={styles.customerCard}>
              <View style={styles.customerAvatar}>
                <Text style={styles.avatarText}>
                  {(order.customerName ?? '?').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" color="primary">
                  {order.customerName}
                </Text>
                <Text variant="bodySmall" color="muted">
                  {order.shippingAddress?.phone}
                </Text>
                <Text variant="bodySmall" color="secondary" numberOfLines={2}>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </Text>
              </View>
            </View>
          </View>

          <Divider />

          {/* Items */}
          <View style={styles.section}>
            <Text variant="label" color="secondary" style={styles.sectionTitle}>
              ITEMS
            </Text>
            {order.items.map(item => {
              return (
                <View key={item.id} style={styles.orderItem}>
                  <Image
                    source={{ uri: item.imageUrl ?? '' }}
                    style={styles.itemImage}
                    contentFit="cover"
                  />
                  <View style={styles.itemInfo}>
                    <Text variant="bodySmall" color="muted" style={{ letterSpacing: 1 }}>
                      {(item.brandName ?? '').toUpperCase()}
                    </Text>
                    <Text variant="titleMedium" color="primary" numberOfLines={1}>
                      {item.modelNumber}
                    </Text>
                    <Text variant="bodySmall" color="secondary">
                      {item.variantName} × {item.quantity}
                    </Text>
                    <Text variant="price" color="gold">
                      {formatPrice(item.totalPrice)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Divider />

          {/* Payment */}
          <View style={styles.section}>
            <Text variant="label" color="secondary" style={styles.sectionTitle}>
              PAYMENT
            </Text>
            <View style={styles.priceRow}>
              <Text variant="body" color="secondary">
                Subtotal
              </Text>
              <Text variant="body" color="primary">
                {formatPrice(order.subtotal)}
              </Text>
            </View>
            {order.discount > 0 && (
              <View style={styles.priceRow}>
                <Text variant="body" color="secondary">
                  Discount
                </Text>
                <Text variant="body" color="success">
                  −{formatPrice(order.discount)}
                </Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text variant="body" color="secondary">
                Shipping
              </Text>
              <Text variant="body" color="primary">
                {formatPrice(order.shipping)}
              </Text>
            </View>
            <Divider />
            <View style={styles.priceRow}>
              <Text variant="headingSmall" color="primary">
                Total
              </Text>
              <Text variant="headingSmall" color="gold">
                {formatPrice(order.total)}
              </Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text variant="caption" color="muted">
                Payment via
              </Text>
              <Text variant="bodySmall" color="primary">
                {(order.paymentMethod ?? '').toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Update Status */}
          {nextStatus && (
            <>
              <Divider />
              <View style={styles.section}>
                <Text variant="label" color="secondary" style={styles.sectionTitle}>
                  UPDATE STATUS
                </Text>
                {(nextStatus === 'shipped' || nextStatus === 'out_for_delivery') && (
                  <Input
                    label="Tracking Number (optional)"
                    placeholder="Enter courier tracking number"
                    value={trackingNumber}
                    onChangeText={setTrackingNumber}
                    autoCapitalize="characters"
                  />
                )}
                <Button
                  label={`Mark as ${nextStatus.replace(/_/g, ' ').toUpperCase()}`}
                  onPress={handleStatusUpdate}
                  isLoading={statusMutation.isPending}
                  variant="gold"
                  fullWidth
                />
              </View>
            </>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { letterSpacing: 5 },
  content: { padding: Spacing[4], gap: Spacing[3] },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderMetaLeft: { gap: Spacing[1] },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  section: { gap: Spacing[3] },
  sectionTitle: { letterSpacing: 3 },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, color: Colors.amber, fontWeight: '600' },
  orderItem: {
    flexDirection: 'row',
    gap: Spacing[3],
    paddingVertical: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  itemImage: { width: 64, height: 80, backgroundColor: Colors.surface },
  itemInfo: { flex: 1, gap: Spacing[1] },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing[1],
  },
});

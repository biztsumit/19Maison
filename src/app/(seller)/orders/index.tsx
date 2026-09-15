import { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from '@/components/common/Text';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { SellerService } from '@/api/services/seller.service';
import { formatPrice, formatDate, formatOrderNumber } from '@/utils/formatters';
import type { Order, OrderStatus } from '@/types';

const STATUS_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
];

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

function OrderCard({ order }: { order: Order }) {
  const firstItem = order.items[0];
  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push(`/(seller)/orders/${order.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.orderCardTop}>
        <Text variant="label" color="primary">
          {formatOrderNumber(order.orderNumber)}
        </Text>
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[order.status] }]} />
        <Text variant="caption" style={{ color: STATUS_COLOR[order.status] }}>
          {order.status.replace(/_/g, ' ').toUpperCase()}
        </Text>
      </View>

      <View style={styles.orderCardMeta}>
        <Text variant="bodySmall" color="muted">
          {formatDate(order.createdAt)}
        </Text>
        <Text variant="bodySmall" color="muted">
          {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </Text>
      </View>

      {firstItem && (
        <Text variant="bodySmall" color="secondary" numberOfLines={1}>
          {firstItem.product.name}
          {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
        </Text>
      )}

      <View style={styles.orderCardFooter}>
        <View>
          <Text variant="caption" color="muted">
            Customer
          </Text>
          <Text variant="bodySmall" color="primary">
            {order.shippingAddress.fullName}
          </Text>
        </View>
        <Text variant="price" color="gold">
          {formatPrice(order.total)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SellerOrdersScreen() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['seller-orders', activeTab],
    queryFn: () =>
      SellerService.getOrders({ status: activeTab !== 'all' ? activeTab : undefined }),
  });

  const orders = data?.data ?? [];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text variant="label" style={styles.headerTitle}>
            ORDERS
          </Text>
        </View>

        {/* Status filter tabs */}
        <FlatList
          data={STATUS_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.value}
          contentContainerStyle={styles.tabs}
          style={styles.tabsBar}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === item.value && styles.tabActive]}
              onPress={() => setActiveTab(item.value)}
            >
              <Text
                variant="label"
                style={[styles.tabLabel, activeTab === item.value && styles.tabLabelActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        {isLoading ? (
          <View style={styles.skeletonList}>
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <View key={i} style={styles.orderCard}>
                  <Skeleton height={14} width="50%" />
                  <Skeleton height={12} width="30%" />
                  <Skeleton height={12} width="70%" />
                </View>
              ))}
          </View>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders"
            subtitle={
              activeTab === 'all'
                ? 'Orders will appear here once customers purchase'
                : `No ${activeTab} orders`
            }
          />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={order => order.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing[3] }} />}
            renderItem={({ item }) => <OrderCard order={item} />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { letterSpacing: 5 },
  tabsBar: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabs: { paddingHorizontal: Spacing[4], gap: Spacing[1], paddingVertical: Spacing[2] },
  tab: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[1.5],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: { borderColor: Colors.amber, backgroundColor: Colors.surfaceElevated },
  tabLabel: { color: Colors.textMuted, letterSpacing: 2, fontSize: 10 },
  tabLabelActive: { color: Colors.amber },
  list: { padding: Spacing[4], paddingBottom: Spacing[10] },
  skeletonList: { padding: Spacing[4], gap: Spacing[4] },
  orderCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
    gap: Spacing[2],
  },
  orderCardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  orderCardMeta: { flexDirection: 'row', gap: Spacing[4] },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing[1],
  },
});

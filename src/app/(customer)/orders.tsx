import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';

interface MockOrder {
  id: string;
  model: string;
  brand: string;
  status: 'dispatched' | 'delivered';
  estimatedDate: string;
}

const MOCK_ORDERS: MockOrder[] = [
  { id: '1', model: 'GG1941S-001', brand: 'GUCCI', status: 'dispatched', estimatedDate: '6 June, 2026' },
  { id: '2', model: 'GG145S-001', brand: 'GUCCI', status: 'delivered', estimatedDate: '1 June, 2026' },
];

function BackHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.backHeader, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <Text style={styles.backTitle}>{title}</Text>
      <View style={styles.backSpacer} />
    </View>
  );
}

function StarRow() {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} hitSlop={4}>
          <Text style={styles.starIcon}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function OrderCard({ order }: { order: MockOrder }) {
  const isDelivered = order.status === 'delivered';

  return (
    <View style={styles.orderCard}>
      {/* Product image */}
      <Image
        source={require('../../../assets/images/cart-item-1.png')}
        style={styles.orderImage}
        contentFit="cover"
      />

      <View style={styles.orderInfo}>
        {/* Estimated delivery */}
        <Text style={styles.estimatedText}>
          {isDelivered ? `Delivered on ${order.estimatedDate}` : `Estimate delivery ${order.estimatedDate}`}
        </Text>

        {/* Model name */}
        <Text style={styles.modelText}>{order.model}</Text>

        {/* Actions row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => router.push(`/(customer)/order/${order.id}`)}
            hitSlop={4}
          >
            <Text style={styles.actionLink}>Track order</Text>
          </TouchableOpacity>
          {!isDelivered && (
            <TouchableOpacity hitSlop={4}>
              <Text style={styles.actionLink}>Cancel order</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Rate & Review for delivered orders */}
        {isDelivered && (
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Rate &amp; Review:</Text>
            <StarRow />
          </View>
        )}
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BackHeader title="Orders" />

      {MOCK_ORDERS.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyDesc}>Your orders will appear here.</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(customer)/explore')}
            activeOpacity={0.85}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={MOCK_ORDERS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderCard order={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Back header
  backHeader: {
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backArrow: {
    fontSize: 22,
    color: '#000000',
  },
  backTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  backSpacer: {
    width: 38,
  },

  // Order card
  orderCard: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
    gap: 16,
  },
  orderImage: {
    width: 122,
    height: 59,
    borderRadius: 4,
  },
  orderInfo: {
    gap: 8,
  },
  estimatedText: {
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    color: '#626262',
    lineHeight: FontSize.sm * 1.3,
  },
  modelText: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: '#000000',
    lineHeight: FontSize.lg * 1.3,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 4,
  },
  actionLink: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#000000',
    textDecorationLine: 'underline',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  rateLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    color: '#000000',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  starIcon: {
    fontSize: 20,
    color: '#D4AF37',
  },

  // Empty state
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  emptyTitle: {
    fontFamily: Font.medium,
    fontSize: FontSize.xl,
    color: '#000000',
  },
  emptyDesc: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: '#626262',
    textAlign: 'center',
  },
  shopBtn: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
  },
  shopBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

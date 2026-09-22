import { Thumbnail } from '@/components/customer/ui/Thumbnail';
import { CUSTOMER_HOME, STAFF_HOME } from '@/constants/routes';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/common/Text';
import { useCart } from '@/hooks/useCart';
import { Font, FontSize } from '@/theme/typography';
import { formatPrice } from '@/utils/formatters';

// ─── Cart Screen ──────────────────────────────────────────────────────────────

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, cart, total, isLoading, updateQuantity, removeItem } = useCart();

  const subtotal = cart?.subtotal ?? total;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // ── Qty stepper handlers ───────────────────────────────────────────────────

  function handleIncrement(cartItemId: string, currentQty: number) {
    updateQuantity(cartItemId, currentQty + 1);
  }

  function handleDecrement(cartItemId: string, currentQty: number) {
    if (currentQty <= 1) {
      removeItem(cartItemId);
    } else {
      updateQuantity(cartItemId, currentQty - 1);
    }
  }

  // ── Empty state ────────────────────────────────────────────────────────────

  function renderEmptyState() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.browseButton}
          activeOpacity={0.8}
          onPress={() => router.push(STAFF_HOME)}
        >
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Cart item row ──────────────────────────────────────────────────────────

  function renderCartItem(item: (typeof items)[number]) {
    const imageUrl = item.product.images[0]?.url;
    const variantLabel =
      item.variant.frameColor + (item.variant.size != null ? ' ' + item.variant.size : '');

    return (
      <View key={item.id} style={styles.itemRow}>
        {/* Product image */}
        {imageUrl ? (
          <Thumbnail uri={imageUrl} tone="dark" style={styles.itemImage} contentFit="cover" />
        ) : (
          <LinearGradient colors={['#E8E8E8', '#D0D0D0']} style={styles.itemImage} />
        )}

        {/* Info column */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemBrand}>{item.product.brand.name.toUpperCase()}</Text>
          <Text style={styles.itemModel}>{item.product.name}</Text>
          <Text style={styles.itemVariant}>{variantLabel}</Text>
        </View>

        {/* Right column: stepper + price */}
        <View style={styles.itemRight}>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              style={styles.stepperBtn}
              activeOpacity={0.7}
              onPress={() => handleDecrement(item.id, item.quantity)}
            >
              <Text style={styles.stepperIcon}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperQty}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              activeOpacity={0.7}
              onPress={() => handleIncrement(item.id, item.quantity)}
            >
              <Text style={styles.stepperIcon}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.itemPrice}>
            {formatPrice(item.variant.salePrice * item.quantity)}
          </Text>
        </View>
      </View>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 50 }]}>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      {/* Gold promo banner */}
      <View style={styles.promoBanner}>
        <Text style={styles.promoText}>
          {'FREE SHIPPING UNLOCKED • COMPLIMENTARY TRAVEL CASE\nWITH 3+ PAIRS'}
        </Text>
      </View>

      {/* Cart items */}
      {items.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          style={styles.itemList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.itemListContent}
        >
          {items.map(item => renderCartItem(item))}
        </ScrollView>
      )}

      {/* Cart summary (sticky bottom) — only shown when items exist */}
      {items.length > 0 && (
        <View style={[styles.summaryContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {/* Add Note row */}
          <TouchableOpacity style={styles.summaryRow} activeOpacity={0.7}>
            <Text style={styles.summaryRowLabel}>Add Note</Text>
            <Text style={styles.summaryRowIcon}>+</Text>
          </TouchableOpacity>

          {/* Discount row */}
          <TouchableOpacity style={styles.summaryRow} activeOpacity={0.7}>
            <Text style={styles.summaryRowLabel}>Discount</Text>
            <Text style={styles.summaryRowIcon}>+</Text>
          </TouchableOpacity>

          {/* Totals + checkout */}
          <View style={styles.totalsBlock}>
            {/* Subtotal line */}
            <View style={styles.totalLine}>
              <Text style={styles.subtotalLabel}>
                Sub Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </Text>
              <Text style={styles.subtotalValue}>{formatPrice(subtotal)}</Text>
            </View>

            {/* Total line */}
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>

            {/* Checkout button */}
            <TouchableOpacity
              style={styles.checkoutBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/(staff)/checkout')}
            >
              <Text style={styles.checkoutBtnText}>{'CHECKOUT • ' + formatPrice(total)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const BORDER_COLOR = 'rgba(221,221,221,0.87)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  headerTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    color: '#000000',
  },

  // ── Promo banner ────────────────────────────────────────────────────────────
  promoBanner: {
    backgroundColor: '#D4AF37',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  promoText: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.6,
    color: '#000000',
    textAlign: 'center',
  },

  // ── Item list ────────────────────────────────────────────────────────────────
  itemList: {
    flex: 1,
  },
  itemListContent: {
    paddingBottom: 8,
  },

  // ── Cart item row ────────────────────────────────────────────────────────────
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  itemImage: {
    width: 133,
    height: 64,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
    gap: 6,
  },
  itemBrand: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    color: '#000000',
  },
  itemModel: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: '#000000',
  },
  itemVariant: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    color: '#626262',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },

  // ── Qty stepper ──────────────────────────────────────────────────────────────
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperIcon: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: '#000000',
    lineHeight: FontSize.lg * 1.2,
  },
  stepperQty: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: '#000000',
    minWidth: 24,
    textAlign: 'center',
  },
  itemPrice: {
    fontFamily: Font.regular,
    fontSize: FontSize.xl,
    color: '#000000',
  },

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: '#626262',
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseButtonText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ── Summary container ─────────────────────────────────────────────────────────
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },

  // Add Note / Discount rows
  summaryRow: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  summaryRowLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#000000',
  },
  summaryRowIcon: {
    fontFamily: Font.medium,
    fontSize: FontSize.xl,
    color: '#000000',
  },

  // Totals block
  totalsBlock: {
    paddingHorizontal: 40,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotalLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#626262',
  },
  subtotalValue: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#626262',
  },
  totalLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.xl,
    color: '#000000',
  },
  totalValue: {
    fontFamily: Font.medium,
    fontSize: FontSize.xl,
    color: '#000000',
  },

  // Checkout button
  checkoutBtn: {
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  checkoutBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

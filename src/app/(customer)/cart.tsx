import { Text } from '@/components/common/Text';
import { useCart } from '@/hooks/useCart';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import type { CartItem } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Sub-components ──────────────────────────────────────────────────────────

/** Figma: centered "Cart" title, bottom border */
function CartHeader({ paddingTop }: { paddingTop: number }) {
  return (
    <View style={[headerStyles.container, { paddingTop: paddingTop + 16 }]}>
      <Text style={headerStyles.title}>Cart</Text>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  // Figma: "Cart" SemiBold 24/100% centered, bottom border 1px rgba(221,221,221,0.87)
  container: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorder,
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'],
    color: Colors.textDark,
  },
});

/** Figma: gold promo banner full-width */
function PromoBanner() {
  return (
    <View style={bannerStyles.container}>
      {/* Figma: Poppins Medium 14/160% #000000 center */}
      <Text style={bannerStyles.text}>
        FREE SHIPPING UNLOCKED • COMPLIMENTARY TRAVEL CASE WITH 3+ PAIRS
      </Text>
    </View>
  );
}

const bannerStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  text: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.6,
    color: Colors.textDark,
    textAlign: 'center',
  },
});

/** Figma: quantity stepper — remove / count / add */
interface QtyStepperProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

function QtyStepper({ quantity, onDecrement, onIncrement }: QtyStepperProps) {
  return (
    <View style={stepperStyles.row}>
      {/* Figma: border rgba(221,221,221,0.87), padding 12 6 */}
      <TouchableOpacity style={stepperStyles.btn} onPress={onDecrement} activeOpacity={0.7}>
        <Text style={stepperStyles.btnText}>−</Text>
      </TouchableOpacity>

      {/* Figma: Poppins Medium 18 CENTER, paddingHorizontal 16, bg white, borderRadius 2 */}
      <View style={stepperStyles.countWrap}>
        <Text style={stepperStyles.countText}>{quantity}</Text>
      </View>

      <TouchableOpacity style={stepperStyles.btn} onPress={onIncrement} activeOpacity={0.7}>
        <Text style={stepperStyles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const stepperStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    paddingHorizontal: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
  },
  btnText: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: Colors.textDark,
    lineHeight: FontSize.lg,
  },
  countWrap: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
  },
  // Figma: Poppins Medium 18 center
  countText: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: Colors.textDark,
    textAlign: 'center',
  },
});

/** Figma: accordion row (Discount / Add Note) */
interface AccordionRowProps {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

function AccordionRow({ label, expanded, onToggle, children }: AccordionRowProps) {
  return (
    <View style={accordionStyles.container}>
      <TouchableOpacity style={accordionStyles.row} onPress={onToggle} activeOpacity={0.7}>
        {/* Figma: Poppins Medium 18/100% #000000 */}
        <Text style={accordionStyles.label}>{label}</Text>
        {/* Figma: "+" icon 20px */}
        <Text style={accordionStyles.icon}>{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      {expanded && children}
    </View>
  );
}

const accordionStyles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightBorder,
  },
  // Figma: row, padding 20 24
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  // Figma: Poppins Medium 18/100% #000000
  label: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg,
    color: Colors.textDark,
  },
  icon: {
    fontSize: 20,
    color: Colors.textDark,
    fontFamily: Font.regular,
  },
});

/** Figma: footer links row */
const FOOTER_LINKS = [
  'Refund policy',
  'Shipping policy',
  'Privacy policy',
  'Terms of service',
  'Contact Us',
] as const;

function FooterLinks() {
  return (
    <View style={footerStyles.container}>
      {FOOTER_LINKS.map(link => (
        <TouchableOpacity key={link} activeOpacity={0.7}>
          {/* Figma: Poppins Medium 16 underline #D4AF37 */}
          <Text style={footerStyles.link}>{link}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const footerStyles = StyleSheet.create({
  // Figma: row, flexWrap, gap 24, padding 24, center
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    padding: 24,
    justifyContent: 'center',
  },
  link: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: Colors.gold,
    textDecorationLine: 'underline',
  },
});

// ── Cart item row ───────────────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem;
  onDecrement: () => void;
  onIncrement: () => void;
}

function CartItemRow({ item, onDecrement, onIncrement }: CartItemRowProps) {
  const primaryImage =
    item.product.images.find(img => img.isPrimary)?.url ?? item.product.images[0]?.url;

  // Derive display strings from item data
  const brand = item.product.brand?.name ?? '';
  // Use variant color/sku as the color+size descriptor
  const colorSize = item.variant
    ? `${item.variant.frameColor ?? ''}, ${item.variant.sku ?? ''}`.replace(/^,\s*|,\s*$/, '')
    : '';

  return (
    <View style={rowStyles.container}>
      {/* Figma: image 133×64px */}
      <Image
        source={
          primaryImage ? { uri: primaryImage } : require('../../../assets/images/homebanner.png')
        }
        style={rowStyles.image}
        contentFit="cover"
      />

      {/* Info column */}
      <View style={rowStyles.info}>
        {/* Figma: Poppins SemiBold 14/100% #000000 */}
        <Text style={rowStyles.brand}>{brand}</Text>
        {/* Figma: Poppins Regular 18/100% #000000 */}
        <Text style={rowStyles.model}>{item.product.name}</Text>
        {/* Figma: Poppins SemiBold 14/100% #626262 */}
        {colorSize ? <Text style={rowStyles.colorSize}>{colorSize}</Text> : null}

        {/* Qty stepper */}
        <QtyStepper quantity={item.quantity} onDecrement={onDecrement} onIncrement={onIncrement} />
      </View>

      {/* Figma: Poppins Regular 20/100% #000000 */}
      <Text style={rowStyles.price}>{formatPrice(item.unitPrice)}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  // Figma: padding 24, borderBottom 1px rgba(221,221,221,0.87), gap 16
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorder,
    gap: 16,
    alignItems: 'flex-start',
  },
  // Figma: 133×64px
  image: {
    width: 133,
    height: 64,
    backgroundColor: Colors.offWhite,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  // Figma: Poppins SemiBold 14/100% #000000
  brand: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    lineHeight: FontSize.base,
    color: Colors.textDark,
  },
  // Figma: Poppins Regular 18/100% #000000
  model: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg,
    color: Colors.textDark,
  },
  // Figma: Poppins SemiBold 14/100% #626262
  colorSize: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    lineHeight: FontSize.base,
    color: Colors.textGray,
    marginBottom: 8,
  },
  // Figma: Poppins Regular 20/100% #000000
  price: {
    fontFamily: Font.regular,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl,
    color: Colors.textDark,
    flexShrink: 0,
  },
});

// ── Empty state ─────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.icon}>⊟</Text>
      {/* <Image
        source={require('../../../assets/images/tabIcons/cart.png')}
        style={{ width: 120, height: 120 }}
        contentFit="contain"
      /> */}
      <Text style={emptyStyles.title}>Your bag is empty</Text>
      <Text style={emptyStyles.desc}>Add items to continue shopping.</Text>
      <TouchableOpacity
        style={emptyStyles.shopBtn}
        onPress={() => router.push('/(customer)/explore')}
        activeOpacity={0.85}
      >
        <Text style={emptyStyles.shopBtnText}>SHOP NOW</Text>
      </TouchableOpacity>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  icon: { fontSize: 20, color: Colors.textGray },
  title: { fontFamily: Font.medium, fontSize: FontSize.xl, color: Colors.textDark },
  desc: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: Colors.textGray,
    textAlign: 'center',
  },
  shopBtn: {
    borderWidth: 1,
    borderColor: Colors.textDark,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: 8,
  },
  shopBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    color: Colors.textDark,
    letterSpacing: 2,
  },
});

// ── Main screen ─────────────────────────────────────────────────────────────

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { cart, items, total, isLoading, fetchCart, updateQuantity, removeItem, applyCoupon } =
    useCart();

  const [discountExpanded, setDiscountExpanded] = useState(false);
  const [noteExpanded, setNoteExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [note, setNote] = useState('');

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = cart?.subtotal ?? 0;
  const discount = cart?.couponDiscount ?? cart?.discount ?? 0;
  const shipping = cart?.shipping ?? 200;

  const handleDecrement = (item: CartItem) => {
    if (item.quantity === 1) {
      Alert.alert('Remove item', 'Remove this item from your bag?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItem(item.id),
        },
      ]);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrement = (item: CartItem) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    applyCoupon(couponCode.trim());
  };

  // Price breakdown footer component
  const ListFooter = (
    <View>
      {/* Discount accordion */}
      <AccordionRow
        label="Discount"
        expanded={discountExpanded}
        onToggle={() => setDiscountExpanded(v => !v)}
      >
        <View style={styles.accordionContent}>
          <TextInput
            style={styles.couponInput}
            placeholder="Enter coupon code"
            placeholderTextColor={Colors.textGray}
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={handleApplyCoupon}
          />
          <TouchableOpacity
            style={styles.couponApplyBtn}
            onPress={handleApplyCoupon}
            activeOpacity={0.85}
          >
            <Text style={styles.couponApplyText}>APPLY</Text>
          </TouchableOpacity>
        </View>
      </AccordionRow>

      {/* Add Note accordion */}
      <AccordionRow
        label="Add Note"
        expanded={noteExpanded}
        onToggle={() => setNoteExpanded(v => !v)}
      >
        <View style={styles.accordionContent}>
          <TextInput
            style={[styles.couponInput, styles.noteInput]}
            placeholder="Add a note to your order"
            placeholderTextColor={Colors.textGray}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </AccordionRow>

      {/* Price breakdown — Figma: padding 24px */}
      <View style={styles.priceBreakdown}>
        {/* Sub Total row: Poppins Medium 18 / Regular 18 */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabelLg}>Sub Total</Text>
          <Text style={styles.priceValueLg}>{formatPrice(subtotal)}</Text>
        </View>

        {/* Discount row: Poppins Medium 16 / Medium 16 */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabelMd}>Discount (10% Off)</Text>
          <Text style={styles.priceValueMd}>
            {discount > 0 ? `−${formatPrice(discount)}` : formatPrice(0)}
          </Text>
        </View>

        {/* Shipping row: Poppins Medium 16 / Medium 16 */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabelMd}>Shipping</Text>
          <Text style={styles.priceValueMd}>{formatPrice(shipping)}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Total row: Poppins Medium 20 bold / Regular 20 */}
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </View>

      {/* Footer policy links */}
      <FooterLinks />

      {/* Extra bottom spacing so sticky button doesn't overlap last item */}
      <View style={{ height: insets.bottom + 56 + 32 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <CartHeader paddingTop={insets.top} />

      {/* Gold promo banner */}
      <PromoBanner />

      {items.length === 0 && !isLoading ? (
        <EmptyCart />
      ) : (
        <FlatList<CartItem>
          data={items}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CartItemRow
              item={item}
              onDecrement={() => handleDecrement(item)}
              onIncrement={() => handleIncrement(item)}
            />
          )}
          ListFooterComponent={ListFooter}
        />
      )}

      {/* Sticky CHECKOUT button */}
      <View style={[styles.checkoutBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push('/(customer)/checkout')}
          activeOpacity={0.85}
        >
          {/* Figma: "CHECKOUT • ₹ XX,XXX.XX" SemiBold 16 UPPERCASE white */}
          <Text style={styles.checkoutBtnText}>
            CHECKOUT {total > 0 ? `• ${formatPrice(total)}` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // Accordion expanded content (coupon / note)
  accordionContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    paddingHorizontal: 14,
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: Colors.textDark,
    backgroundColor: Colors.white,
  },
  noteInput: {
    height: 80,
    paddingTop: 12,
  },
  couponApplyBtn: {
    backgroundColor: Colors.textDark,
    height: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponApplyText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.sm,
    color: Colors.white,
    letterSpacing: 1,
  },

  // Price breakdown — Figma: padding 24
  priceBreakdown: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightBorder,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Sub Total — Poppins Medium 18 label / Regular 18 value
  priceLabelLg: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: Colors.textDark,
  },
  priceValueLg: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: Colors.textDark,
  },
  // Discount / Shipping — Poppins Medium 16
  priceLabelMd: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  priceValueMd: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightBorder,
    marginVertical: 4,
  },
  // Total — Poppins Medium 20 bold label / Regular 20 value
  totalLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textDark,
  },
  totalValue: {
    fontFamily: Font.regular,
    fontSize: FontSize.xl,
    color: Colors.textDark,
  },

  // Sticky checkout bar
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightBorder,
  },
  // Figma: full width, bg #000000, borderRadius 8, height 56, padding 16 30
  checkoutBtn: {
    backgroundColor: Colors.textDark,
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Figma: Poppins SemiBold 16 UPPERCASE white
  checkoutBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

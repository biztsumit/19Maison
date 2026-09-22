import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useConfirm } from '@/providers/ConfirmProvider';
import { router } from 'expo-router';
import {
  Accordion,
  Button,
  CustomerHeader,
  CustomerScreen,
  EmptyState,
  StickyActionBar,
} from '@/components/customer';
import { CartItemRow } from '@/components/customer/cart/CartItemRow';
import { CartPromoStrip } from '@/components/customer/cart/CartPromoStrip';
import { CartSummary } from '@/components/customer/cart/CartSummary';
import { CouponField } from '@/components/customer/cart/CouponField';
import { useCart } from '@/hooks/useCart';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { CartItem } from '@/types';
import { formatPrice } from '@/utils/formatters';

export default function CartScreen() {
  const confirm = useConfirm();
  const { cart, items, total, isLoading, fetchCart, updateQuantity, removeItem, applyCoupon } =
    useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const confirmRemove = async (item: CartItem) => {
    const ok = await confirm({
      title: 'Remove item',
      message: 'Remove this item from your bag?',
      confirmLabel: 'Remove',
      destructive: true,
    });
    if (ok) removeItem(item.id);
  };

  const handleQuantityChange = (item: CartItem, quantity: number) => {
    if (quantity < 1) {
      confirmRemove(item);
      return;
    }
    updateQuantity(item.id, quantity);
  };

  const header = <CustomerHeader variant="title" title="Cart" />;

  if (!isLoading && items.length === 0) {
    return (
      <CustomerScreen header={header} scroll={false}>
        <EmptyState
          icon="bag"
          title="Your bag is empty"
          message="Browse the collection and add something you love."
          actionLabel="Shop now"
          onAction={() => router.push('/(customer)/(tabs)/explore')}
        />
      </CustomerScreen>
    );
  }

  return (
    <CustomerScreen
      header={header}
      refreshing={isLoading}
      onRefresh={fetchCart}
      footer={
        <StickyActionBar>
          <Button
            label={`Checkout - ${formatPrice(total)}`}
            onPress={() => router.push('/(customer)/checkout')}
            fullWidth
            disabled={items.length === 0}
          />
        </StickyActionBar>
      }
    >
      <CartPromoStrip />

      {items.map(item => (
        <CartItemRow
          key={item.id}
          item={item}
          onQuantityChange={handleQuantityChange}
          onRemove={confirmRemove}
          disabled={isLoading}
        />
      ))}

      <View style={styles.accordions}>
        <Accordion label="Discount">
          <CouponField onApply={applyCoupon} isApplying={isLoading} />
        </Accordion>
      </View>

      <CartSummary
        subtotal={cart?.subtotal ?? 0}
        discount={cart?.couponDiscount ?? cart?.discount ?? 0}
        shipping={cart?.shipping}
        tax={cart?.tax}
        total={total}
        itemCount={items.length}
      />
    </CustomerScreen>
  );
}

const styles = StyleSheet.create({
  accordions: {
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingTop: Spacing[2],
  },
});

import { StyleSheet, View } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Divider } from '../ui/Divider';
import { PriceRow } from '../ui/PriceRow';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  subtotal: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total: number;
  itemCount?: number;
}

export function CartSummary({
  subtotal,
  discount = 0,
  shipping,
  tax = 0,
  total,
  itemCount,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.wrap}>
      <PriceRow label={itemCount ? `Sub total (${itemCount})` : 'Sub total'} value={subtotal} />
      {discount > 0 && <PriceRow label="Discount" value={-discount} />}
      {tax > 0 && <PriceRow label="Tax" value={tax} />}
      {/* Render a dash rather than inventing a figure the server did not send. */}
      <PriceRow
        label="Shipping"
        value={shipping === undefined ? '-' : shipping === 0 ? 'Free' : shipping}
      />
      <Divider />
      <PriceRow label="Total" value={total} emphasis="total" />
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    wrap: {
      gap: Spacing[1],
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[5],
      backgroundColor: c.bg,
    },
  });

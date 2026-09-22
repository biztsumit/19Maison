import { StyleSheet, View } from 'react-native';
import { Thumbnail } from '../ui/Thumbnail';
import type { CartItem } from '@/types';
import type { OrderItem } from '@/types/order.types';
import { CustomerColors } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { formatPrice } from '@/utils/formatters';
import { Text } from '../ui/Text';

// Cart lines and order lines arrive in different shapes, so both are normalised
// to this before rendering rather than duplicating the row component.
export interface LineItemDisplay {
  imageUrl?: string;
  brandName?: string;
  title?: string;
  variantLabel?: string;
  quantity: number;
  totalPrice: number;
}

export const cartItemToLine = (item: CartItem): LineItemDisplay => ({
  imageUrl: item.variant?.images?.[0]?.url ?? item.product?.images?.[0]?.url,
  brandName: item.product?.brand?.name,
  title: item.product?.name,
  variantLabel: [item.variant?.frameColor, item.variant?.size].filter(Boolean).join(' / '),
  quantity: item.quantity,
  totalPrice: item.totalPrice,
});

export const orderItemToLine = (item: OrderItem): LineItemDisplay => ({
  imageUrl: item.imageUrl,
  brandName: item.brandName,
  title: item.modelNumber,
  variantLabel: item.variantName,
  quantity: item.quantity,
  totalPrice: item.totalPrice,
});

interface Props {
  line: LineItemDisplay;
}

export function OrderLineItem({ line }: Props) {
  return (
    <View style={styles.row}>
      <Thumbnail uri={line.imageUrl} style={styles.image} iconSize={20} />

      <View style={styles.info}>
        {Boolean(line.brandName) && <Text variant="cardBrand">{line.brandName}</Text>}
        <Text variant="bodySmallMuted" numberOfLines={2}>
          {line.title}
        </Text>
        {Boolean(line.variantLabel) && <Text variant="caption">{line.variantLabel}</Text>}
        {line.quantity > 1 && <Text variant="caption">Qty {line.quantity}</Text>}
      </View>

      <Text variant="cardPrice">{formatPrice(line.totalPrice)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3] },
  image: { width: 56, height: 72, backgroundColor: CustomerColors.bgAlt },
  info: { flex: 1, gap: Spacing[0.5] },
});

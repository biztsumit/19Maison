import { Pressable, StyleSheet, View } from 'react-native';
import { Thumbnail } from '../ui/Thumbnail';
import { router } from 'expo-router';
import type { CartItem } from '@/types';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { formatPrice } from '@/utils/formatters';
import { Icon } from '../ui/Icon';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Text } from '../ui/Text';

interface Props {
  item: CartItem;
  onQuantityChange: (item: CartItem, quantity: number) => void;
  onRemove: (item: CartItem) => void;
  disabled?: boolean;
}

export function CartItemRow({ item, onQuantityChange, onRemove, disabled = false }: Props) {
  const image = item.variant?.images?.[0]?.url ?? item.product?.images?.[0]?.url;
  const variantLabel = [item.variant?.frameColor, item.variant?.size].filter(Boolean).join(' / ');

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() =>
          item.product?.slug && router.push(`/(customer)/product/${item.product.slug}`)
        }
        accessibilityRole="button"
      >
        <Thumbnail uri={image} style={styles.image} />
      </Pressable>

      <View style={styles.info}>
        <View style={styles.headerRow}>
          <View style={styles.titles}>
            {Boolean(item.product?.brand?.name) && (
              <Text variant="cardBrand">{item.product.brand.name}</Text>
            )}
            <Text variant="bodySmallMuted" numberOfLines={2}>
              {item.product?.name}
            </Text>
            {Boolean(variantLabel) && <Text variant="caption">{variantLabel}</Text>}
          </View>

          <Pressable
            onPress={() => onRemove(item)}
            disabled={disabled}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Remove from bag"
          >
            <Icon name="trash" size={18} color={CustomerColors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.footerRow}>
          <QuantityStepper
            value={item.quantity}
            onChange={next => onQuantityChange(item, next)}
            max={item.variant?.stock}
            hint="Max stock reached"
            disabled={disabled}
          />
          <Text variant="cardPrice">{formatPrice(item.totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing[4],
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingVertical: Spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CustomerColors.border,
  },
  image: { width: 72, height: 96, backgroundColor: CustomerColors.bgAlt },
  info: { flex: 1, gap: Spacing[3] },
  headerRow: { flexDirection: 'row', gap: Spacing[3] },
  titles: { flex: 1, gap: Spacing[0.5] },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[3],
  },
});

import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { Thumbnail } from '../ui/Thumbnail';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';

interface Props {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  variantLabel?: string;
  quantity: number;
}

// The native answer to the web's cart drawer: confirms the add without taking
// the shopper off the product they were looking at.
export function AddedToBagSheet({ visible, onClose, product, variantLabel, quantity }: Props) {
  if (!product) return null;
  const image = product.images[0]?.url;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Added to bag"
      footer={
        <View style={styles.actions}>
          <Button
            label="View bag"
            variant="outline"
            style={styles.action}
            onPress={() => {
              onClose();
              router.push('/(customer)/(tabs)/cart');
            }}
          />
          <Button
            label="Checkout"
            variant="solid"
            style={styles.action}
            onPress={() => {
              onClose();
              router.push('/(customer)/checkout');
            }}
          />
        </View>
      }
    >
      <View style={styles.row}>
        <Thumbnail uri={image} style={styles.image} contentFit="contain" />
        <View style={styles.info}>
          <Text variant="cardBrand">{product.brand?.name}</Text>
          <Text variant="bodySmallMuted" numberOfLines={2}>
            {product.name}
          </Text>
          {variantLabel && <Text variant="caption">{variantLabel}</Text>}
          <Text variant="cardPrice">
            {formatPrice(product.price)}
            {quantity > 1 ? ` x ${quantity}` : ''}
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing[3],
    padding: CustomerLayout.screenPaddingH,
  },
  image: { width: 72, height: 96, backgroundColor: CustomerColors.bgAlt },
  info: { flex: 1, gap: Spacing[1] },
  actions: {
    flexDirection: 'row',
    gap: Spacing[3],
    flex: 1,
    marginBottom: Spacing[10],
  },
  action: { flex: 1 },
});

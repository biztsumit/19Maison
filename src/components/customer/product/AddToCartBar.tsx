import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Button } from '../ui/Button';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Text } from '../ui/Text';
import { StickyActionBar } from '../layout/StickyActionBar';

interface Props {
  quantity: number;
  onQuantityChange: (next: number) => void;
  maxQuantity?: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  adding?: boolean;
  buying?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export function AddToCartBar({
  quantity,
  onQuantityChange,
  maxQuantity,
  onAddToCart,
  onBuyNow,
  adding = false,
  buying = false,
  disabled = false,
  disabledReason,
}: Props) {
  return (
    <StickyActionBar direction="column">
      {disabled && disabledReason && <Text variant="errorText">{disabledReason}</Text>}

      <View style={styles.row}>
        <QuantityStepper
          value={quantity}
          onChange={onQuantityChange}
          max={maxQuantity}
          hint="Max stock reached"
          disabled={disabled}
        />
        <Button
          label="Add to cart"
          variant="outline"
          onPress={onAddToCart}
          loading={adding}
          disabled={disabled || buying}
          style={styles.grow}
        />
      </View>

      <Button
        label="Buy now"
        variant="solid"
        onPress={onBuyNow}
        loading={buying}
        disabled={disabled || adding}
        fullWidth
      />
    </StickyActionBar>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  grow: { flex: 1 },
});

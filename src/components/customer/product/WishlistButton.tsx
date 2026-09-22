import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useWishlistToggle } from '@/hooks/useWishlistToggle';
import { CustomerColors } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';

interface Props {
  productId: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function WishlistButton({ productId, size = 20, style }: Props) {
  const { isWishlisted, isPending, toggle } = useWishlistToggle();
  const active = isWishlisted(productId);
  const pending = isPending(productId);

  return (
    <Pressable
      onPress={() => toggle(productId)}
      disabled={pending}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled: pending }}
      accessibilityLabel={active ? 'Remove from wishlist' : 'Add to wishlist'}
      style={[styles.button, pending && styles.pending, style]}
    >
      <Icon
        name="heart"
        size={size}
        color={active ? CustomerColors.accent : CustomerColors.text}
        fill={active ? CustomerColors.accent : 'none'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing[2],
    backgroundColor: CustomerColors.bg,
    borderWidth: 1,
    borderColor: CustomerColors.border,
  },
  pending: { opacity: 0.5 },
});

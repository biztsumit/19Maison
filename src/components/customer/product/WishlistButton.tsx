import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useWishlistToggle } from '@/hooks/useWishlistToggle';
import { Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  productId: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function WishlistButton({ productId, size = 20, style }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
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
        color={active ? colors.accent : colors.text}
        fill={active ? colors.accent : 'none'}
      />
    </Pressable>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    button: {
      padding: Spacing[2],
      backgroundColor: c.bg,
      borderWidth: 1,
      borderColor: c.border,
    },
    pending: { opacity: 0.5 },
  });

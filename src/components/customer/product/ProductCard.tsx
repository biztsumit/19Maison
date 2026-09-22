import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { useWishlistToggle } from '@/hooks/useWishlistToggle';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { formatPrice } from '@/utils/formatters';
import type { Product } from '@/types';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { ImageCarousel } from '../ui/ImageCarousel';
import { Text } from '../ui/Text';
import { Thumbnail } from '../ui/Thumbnail';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

export type ProductCardVariant = 'grid' | 'rail' | 'collector';

interface Props {
  product: Product;
  width: number;
  imageHeight?: number;
  variant?: ProductCardVariant;
  showBrand?: boolean;
  showWishlist?: boolean;
  onAddToCart?: (product: Product) => void;
  onPress?: (product: Product) => void;
  cta?: { label: string; onPress: (product: Product) => void };
  style?: StyleProp<ViewStyle>;
}

// The single card implementation. Replaces the three divergent inline versions
// that lived in the home screen, the explore screen and components/product.
export function ProductCard({
  product,
  width,
  imageHeight,
  variant = 'grid',
  showBrand = true,
  showWishlist = true,
  onAddToCart,
  onPress,
  cta,
  style,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const { isWishlisted, isPending, toggle } = useWishlistToggle();

  const images = product.images.map(i => i.url).filter(Boolean);
  const height = imageHeight ?? Math.round(width * 0.85);
  const wishlisted = isWishlisted(product.id);
  const pending = isPending(product.id);

  // Navigation is by slug; wishlist membership is keyed by id.
  const handlePress = () =>
    onPress ? onPress(product) : router.push(`/(customer)/product/${product.slug}`);

  const hasDiscount = product.comparePrice !== undefined && product.comparePrice > product.price;

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={product.name}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed, style]}
    >
      <View style={styles.topRow}>
        {onAddToCart ? (
          <Pressable
            onPress={() => onAddToCart(product)}
            hitSlop={8}
            accessibilityLabel={`Add ${product.name} to bag`}
          >
            <Icon name="bag" size={18} color={colors.text} />
          </Pressable>
        ) : (
          <View />
        )}

        {showWishlist && (
          <Pressable
            onPress={() => toggle(product.id)}
            disabled={pending}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={{ selected: wishlisted, disabled: pending }}
            accessibilityLabel={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            style={pending && styles.pendingHeart}
          >
            <Icon
              name="heart"
              size={18}
              color={wishlisted ? colors.accent : colors.text}
              fill={wishlisted ? colors.accent : 'none'}
            />
          </Pressable>
        )}
      </View>

      {images.length > 0 ? (
        <ImageCarousel
          images={images}
          width={width}
          height={height}
          contentFit="contain"
          showCounter={images.length > 1}
        />
      ) : (
        <Thumbnail style={{ width, height }} iconSize={36} />
      )}

      <View style={styles.info}>
        {showBrand && Boolean(product.brand?.name) && (
          <Text variant="cardBrand" numberOfLines={1}>
            {product.brand.name}
          </Text>
        )}
        <Text variant="bodySmallMuted" numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text variant="cardPrice">{formatPrice(product.price)}</Text>
          {hasDiscount && (
            <Text variant="priceStrike">{formatPrice(product.comparePrice as number)}</Text>
          )}
        </View>
      </View>

      {variant === 'collector' && cta && (
        <Button label={cta.label} onPress={() => cta.onPress(product)} size="sm" fullWidth />
      )}
    </Pressable>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: CustomerLayout.cardRadius,
      backgroundColor: c.bg,
      overflow: 'hidden',
    },
    pressed: { opacity: 0.9 },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing[3],
      paddingTop: Spacing[3],
    },
    pendingHeart: { opacity: 0.5 },
    info: { paddingHorizontal: Spacing[3], paddingBottom: Spacing[3], gap: Spacing[1] },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  });

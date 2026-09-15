import { View, TouchableOpacity, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';
import { formatPrice } from '@/utils/formatters';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  style?: ViewStyle;
  // 'small' = 176×200 (home/explore), 'large' = 182×220 (collection/wishlist)
  size?: 'small' | 'large';
  onWishlistToggle?: (productId: string) => void;
}

// Figma: product card — border rgba(221,221,221,0.87), white bg
// Small (home/explore): 176×200px total, image 176×136px, bag chip 38×38
// Large (collection/wishlist): 182×220px total, image 182×170px, bag chip 30×30
export function ProductCard({ product, style, size = 'small', onWishlistToggle }: ProductCardProps) {
  const primaryImage = product.images.find(img => img.isPrimary) ?? product.images[0];
  const isLarge = size === 'large';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isLarge ? styles.containerLarge : styles.containerSmall,
        style,
      ]}
      onPress={() => router.push(`/(customer)/product/${product.slug}`)}
      activeOpacity={0.92}
    >
      <View style={[styles.imageWrap, isLarge ? styles.imageWrapLarge : styles.imageWrapSmall]}>
        <Image
          source={{ uri: primaryImage?.url ?? '' }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        {/* Figma: shopping bag chip — absolute bottom-right of image */}
        <TouchableOpacity
          style={[styles.bagChip, isLarge ? styles.bagChipLarge : styles.bagChipSmall]}
          hitSlop={4}
        >
          <Text style={styles.bagIcon}>⊟</Text>
        </TouchableOpacity>
      </View>

      {/* Figma: product name Bold 14 #626262, price Bold 16 #000000 */}
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },

  // Figma: 176×200px (home/latest drop)
  containerSmall: { width: 176 },

  // Figma: 182×220px (collection/wishlist)
  containerLarge: { width: 182 },

  imageWrap: { overflow: 'hidden', position: 'relative' },

  // Figma: image 176×136
  imageWrapSmall: { height: 136 },

  // Figma: image 182×170
  imageWrapLarge: { height: 170 },

  image: { width: '100%', height: '100%' },

  // Figma: shopping bag chip — circular, absolute bottom-right
  bagChip: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 8,
    right: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Figma: 38×38 (small card)
  bagChipSmall: { width: 38, height: 38 },

  // Figma: 30×30 (large card)
  bagChipLarge: { width: 30, height: 30 },

  bagIcon: { fontSize: 14, color: Colors.textGray },

  // Figma: padding 8px, gap 8px between name and price
  info: { paddingHorizontal: 8, paddingVertical: 8, gap: 4 },

  // Figma: Poppins Bold 14/130%, #626262
  productName: {
    fontFamily: Font.bold,
    fontSize: FontSize.base,
    color: Colors.textGray,
    lineHeight: FontSize.base * 1.3,
  },

  // Figma: Poppins Bold 16/130%, #000000
  productPrice: {
    fontFamily: Font.bold,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
});

import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface Props {
  products: Product[];
  columns?: number;
  gap?: number;
  gutter?: number;
  availableWidth: number;
  loading?: boolean;
  skeletonCount?: number;
  onAddToCart?: (product: Product) => void;
  style?: StyleProp<ViewStyle>;
}

// A plain wrapping View rather than a list: every caller renders this inside an
// outer ScrollView, and nesting a virtualised list there is worse than useless.
export function ProductGrid({
  products,
  columns = 2,
  gap = Spacing[3],
  gutter = CustomerLayout.screenPaddingH,
  availableWidth,
  loading = false,
  skeletonCount = 4,
  onAddToCart,
  style,
}: Props) {
  const cardWidth = Math.floor((availableWidth - gutter * 2 - gap * (columns - 1)) / columns);

  return (
    <View style={[styles.grid, { gap }, style]}>
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <ProductCardSkeleton key={i} width={cardWidth} />
          ))
        : products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              width={cardWidth}
              onAddToCart={onAddToCart}
            />
          ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});

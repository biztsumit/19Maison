import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { useProductsInfinite } from '@/hooks/useProducts';
import { Spacing } from '@/theme/spacing';
import { HorizontalRail } from '../layout/HorizontalRail';
import { Section } from '../layout/Section';
import { SectionHeader } from '../layout/SectionHeader';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface Props {
  brandSlug?: string;
  excludeId: string;
}

export function RelatedProducts({ brandSlug, excludeId }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.round(width * 0.46);

  // The filter key is the group id the API advertises (`brand`), not `brandSlugs`.
  const { data, isLoading } = useProductsInfinite({
    limit: 10,
    ...(brandSlug ? { brand: [brandSlug] } : {}),
  });

  const products = (data?.pages.flatMap(page => page.products) ?? []).filter(
    product => product.id !== excludeId,
  );

  if (!isLoading && products.length === 0) return null;

  return (
    <Section gutter={false}>
      <View style={styles.headerWrap}>
        <SectionHeader
          title="Related products"
          cta={
            brandSlug
              ? {
                  label: 'View more',
                  onPress: () =>
                    router.push({
                      pathname: '/(customer)/(tabs)/explore',
                      params: { brand: brandSlug },
                    }),
                }
              : undefined
          }
        />
      </View>

      {isLoading ? (
        <HorizontalRail
          data={[0, 1]}
          itemWidth={cardWidth}
          keyExtractor={i => String(i)}
          renderItem={() => <ProductCardSkeleton width={cardWidth} />}
        />
      ) : (
        <HorizontalRail
          data={products}
          itemWidth={cardWidth}
          snap
          keyExtractor={product => product.id}
          renderItem={product => <ProductCard product={product} width={cardWidth} />}
        />
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: Spacing[6] },
});

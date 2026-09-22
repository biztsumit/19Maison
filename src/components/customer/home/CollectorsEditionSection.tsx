import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import type { Product } from '@/types';
import { Spacing } from '@/theme/spacing';
import { HorizontalRail } from '../layout/HorizontalRail';
import { Section } from '../layout/Section';
import { SectionHeader } from '../layout/SectionHeader';
import { ProductCard } from '../product/ProductCard';
import { ProductCardSkeleton } from '../product/ProductCardSkeleton';

interface Props {
  products: Product[];
  isLoading?: boolean;
}

// Gold section. Cards carry an enquiry CTA rather than add-to-cart, matching the web.
export function CollectorsEditionSection({ products, isLoading = false }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.round(width * 0.58);

  if (!isLoading && products.length === 0) return null;

  return (
    <Section background="gold" gutter={false}>
      <View style={styles.headerWrap}>
        <SectionHeader title="Collectors Edition" />
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
          renderItem={product => (
            <ProductCard
              product={product}
              width={cardWidth}
              variant="collector"
              cta={{
                label: 'Enquiry now',
                onPress: p => router.push(`/(customer)/product/${p.slug}`),
              }}
            />
          )}
        />
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: Spacing[6] },
});

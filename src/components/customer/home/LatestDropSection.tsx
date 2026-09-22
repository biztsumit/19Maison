import { useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import type { Product } from '@/types';
import { Section } from '../layout/Section';
import { SectionHeader } from '../layout/SectionHeader';
import { ProductGrid } from '../product/ProductGrid';

interface Props {
  products: Product[];
  isLoading?: boolean;
}

export function LatestDropSection({ products, isLoading = false }: Props) {
  const { width } = useWindowDimensions();
  if (!isLoading && products.length === 0) return null;

  return (
    <Section>
      <SectionHeader
        title="Latest drop"
        cta={{ label: 'View more', onPress: () => router.push('/(customer)/(tabs)/explore') }}
      />
      <ProductGrid
        products={products}
        availableWidth={width}
        loading={isLoading}
        skeletonCount={4}
      />
    </Section>
  );
}

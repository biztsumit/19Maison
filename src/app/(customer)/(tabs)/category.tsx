import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import {
  Accordion,
  Chip,
  CustomerHeader,
  CustomerScreen,
  EmptyState,
  Skeleton,
  Text,
} from '@/components/customer';
import { Thumbnail } from '@/components/customer/ui/Thumbnail';
import { toFilterRouteParams } from '@/api/services/navigation.service';
import type { NavFilterParams } from '@/api/services/navigation.service';
import { useActiveBrands } from '@/hooks/useBrands';
import { useResetOnTabPress } from '@/hooks/useResetOnTabPress';
import { useNavigation } from '@/hooks/useNavigation';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { brandImage, brandInitials } from '@/utils/brand-image';

// Nav entries carry the filter values to apply, so they pass straight through as
// route params. Explore seeds its filters from whatever keys arrive.
const goToFiltered = (params: NavFilterParams) =>
  router.push({
    pathname: '/(customer)/(tabs)/explore',
    params: toFilterRouteParams(params),
  });

export default function CategoryScreen() {
  // Accordion open/closed state lives inside the components, so re-entering the
  // tab remounts them rather than trying to reach in and collapse each one.
  const [resetKey, setResetKey] = useState(0);
  useResetOnTabPress(useCallback(() => setResetKey(k => k + 1), []));

  const { data: categories, isLoading } = useNavigation();
  const { data: brands = [] } = useActiveBrands();

  const header = <CustomerHeader variant="title" title="Categories" />;

  if (isLoading) {
    return (
      <CustomerScreen header={header} contentContainerStyle={styles.body}>
        <Skeleton height={58} />
        <Skeleton height={58} />
        <Skeleton height={58} />
      </CustomerScreen>
    );
  }

  const navCategories = categories ?? [];

  if (navCategories.length === 0 && brands.length === 0) {
    return (
      <CustomerScreen header={header} scroll={false}>
        <EmptyState
          icon="grid"
          title="No categories yet"
          message="Browse the full collection instead."
          actionLabel="Shop all"
          onAction={() => router.push('/(customer)/(tabs)/explore')}
        />
      </CustomerScreen>
    );
  }

  return (
    <CustomerScreen key={resetKey} header={header} contentContainerStyle={styles.body}>
      {navCategories.map(category => {
        const sections = (category.sections ?? []).filter(s => s.items?.length > 0);

        return (
          <Accordion key={category.key} label={category.label} defaultOpen={false}>
            <View style={styles.categoryBody}>
              <Pressable
                onPress={() => goToFiltered(category.filterParams)}
                accessibilityRole="button"
                hitSlop={6}
              >
                <Text variant="link">View all {category.label.toLowerCase()}</Text>
              </Pressable>

              {sections.map(section => (
                <View key={section.title} style={styles.section}>
                  <Text variant="cardBrand">{section.title}</Text>
                  <View style={styles.chips}>
                    {section.items.map(item => (
                      <Chip
                        key={item.label}
                        label={item.label}
                        onPress={() => goToFiltered(item.filterParams)}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Accordion>
        );
      })}

      {brands.length > 0 && (
        <Accordion label="Shop by Brand" defaultOpen>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
          >
            {brands.map(brand => (
              <Pressable
                key={brand.slug ?? brand.name}
                onPress={() =>
                  router.push({
                    pathname: '/(customer)/(tabs)/explore',
                    params: { brand: brand.slug ?? brand.name.toLowerCase() },
                  })
                }
                accessibilityRole="button"
                style={({ pressed }) => [styles.railTile, pressed && styles.pressed]}
              >
                <Thumbnail
                  uri={brandImage(brand)}
                  style={styles.railImage}
                  fallbackText={brandInitials(brand.name)}
                  iconSize={32}
                />
                <Text variant="bodySmall" numberOfLines={1} style={styles.tileLabel}>
                  {brand.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Accordion>
      )}
    </CustomerScreen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: CustomerLayout.screenPaddingH },
  categoryBody: { gap: Spacing[5] },
  section: { gap: Spacing[3] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  rail: { flexDirection: 'row', gap: Spacing[3] },
  railTile: { width: 116 },
  railImage: { width: 116, height: 116, backgroundColor: CustomerColors.bgAlt },
  tileLabel: { marginTop: Spacing[2], textAlign: 'center' },
  pressed: { opacity: 0.8 },
});

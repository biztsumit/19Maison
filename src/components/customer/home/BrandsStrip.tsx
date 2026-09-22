import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import type { BrandItem } from '@/types/homepage.types';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Font, FontSize } from '@/theme/typography';
import { brandImage, brandInitials } from '@/utils/brand-image';
import { Skeleton } from '../ui/Skeleton';
import { Text } from '../ui/Text';
import { Thumbnail } from '../ui/Thumbnail';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  brands: BrandItem[];
  isLoading?: boolean;
}

// Figma: sits directly beneath the search bar on the black header block.
// 60pt circles with a 1px #626262 stroke, Poppins Bold 12 white labels.
const CIRCLE = 60;

export function BrandsStrip({ brands, isLoading = false }: Props) {
  const styles = useThemedStyles(makeStyles);
  // Render every active brand; a missing logo falls back rather than dropping it.
  const visible = brands;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {[0, 1, 2, 3, 4].map(i => (
            <View key={i} style={styles.item}>
              <Skeleton width={CIRCLE} height={CIRCLE} radius={BorderRadius.full} />
              <Skeleton width={40} height={10} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (visible.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {visible.map(brand => (
          <Pressable
            key={brand.slug ?? brand.name}
            onPress={() =>
              router.push({
                pathname: '/(customer)/(tabs)/explore',
                params: { brand: brand.slug ?? brand.name.toLowerCase() },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={brand.name}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            {/* Dark tone: this strip sits on the black header, so the default
                light placeholder tile would flash as a white circle. */}
            <Thumbnail
              uri={brandImage(brand)}
              style={styles.circle}
              fallbackText={brandInitials(brand.name)}
              iconSize={22}
              tone="dark"
            />
            <Text style={styles.label} numberOfLines={1}>
              {brand.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.bgDark,
      paddingVertical: Spacing[4],
    },
    row: { flexDirection: 'row', gap: Spacing[4], paddingHorizontal: Spacing[6] },
    item: { alignItems: 'center', justifyContent: 'center', gap: Spacing[2.5], width: CIRCLE },
    pressed: { opacity: 0.7 },
    circle: {
      width: CIRCLE,
      height: CIRCLE,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: c.textMuted,
      backgroundColor: c.bgDarkAlt,
    },
    label: {
      fontFamily: Font.bold,
      fontSize: FontSize.sm,
      lineHeight: FontSize.sm,
      color: c.textInverse,
    },
  });

import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import type { GenderSection } from '@/types/homepage.types';
import { CustomerColors } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Font, FontSize } from '@/theme/typography';
import { genderArtwork } from '@/utils/fallback-images';
import { Text } from '../ui/Text';
import { Thumbnail } from '../ui/Thumbnail';
import { GENDER_LABEL } from './constants';

interface Props {
  sections: GenderSection[];
}

// Figma: three equal tiles in a row on #F9F9F9. Images are 121pt tall with a
// 100pt corner radius, labels in Poppins Medium 14 beneath.
const TILE_HEIGHT = 121;

export function ShopByGenderSection({ sections }: Props) {
  // Only hide when there is no gender data at all. A missing imageUrl must not
  // suppress the whole section: the tile is still a working entry point, and
  // filtering on the image is why this section rendered as nothing.
  if (sections.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Choose by gender</Text>

      <View style={styles.row}>
        {sections.map(section => {
          const label = GENDER_LABEL[section.gender] ?? section.gender;
          return (
            <Pressable
              key={section.gender}
              onPress={() =>
                router.push({
                  pathname: '/(customer)/(tabs)/explore',
                  params: { targetAudience: section.gender },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Shop for ${label}`}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            >
              <Thumbnail
                uri={section.imageUrl}
                fallbackSource={genderArtwork(section.gender)}
                style={styles.image}
                iconSize={32}
              />
              <Text style={styles.label}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: CustomerColors.bgAlt,
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[4],
    gap: Spacing[6],
  },
  heading: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * 1.3,
    color: CustomerColors.text,
  },
  row: { flexDirection: 'row', gap: Spacing[4] },
  tile: { flex: 1, alignItems: 'center', gap: Spacing[2.5] },
  pressed: { opacity: 0.8 },
  image: {
    width: '100%',
    height: TILE_HEIGHT,
    borderRadius: BorderRadius.full,
    backgroundColor: CustomerColors.border,
  },
  label: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base,
    color: CustomerColors.text,
  },
});

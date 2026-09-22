import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Thumbnail } from '../ui/Thumbnail';
import type { GalleryImage } from '@/types/homepage.types';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import { HorizontalRail } from '../layout/HorizontalRail';
import { Section } from '../layout/Section';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  images: GalleryImage[];
  handle?: string;
}

export function InstagramSection({ images, handle = '@19maison' }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const visible = images.filter(i => i.imageUrl);
  if (visible.length === 0) return null;

  const tile = Math.round(width * 0.42);

  return (
    <Section gutter={false}>
      <View style={styles.header}>
        <Text variant="sectionHeading">Follow our world</Text>
        <View style={styles.pill}>
          <Icon name="camera" size={16} color={colors.text} />
          <Text variant="bodySmall">{handle}</Text>
        </View>
      </View>

      <HorizontalRail
        data={visible}
        itemWidth={tile}
        snap
        keyExtractor={image => image.documentId}
        renderItem={image => (
          <Thumbnail
            uri={image.imageUrl}
            style={{ width: tile, height: tile }}
            placeholder="camera"
          />
        )}
      />
    </Section>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing[3],
      paddingHorizontal: Spacing[6],
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing[2],
      paddingHorizontal: Spacing[3],
      paddingVertical: Spacing[2],
      borderRadius: BorderRadius.full,
      backgroundColor: c.accentMuted,
    },
  });

import { StyleSheet, View } from 'react-native';
import { Font } from '@/theme/typography';
import type { ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import type { ImageContentFit } from 'expo-image';
import { Colors } from '@/theme/colors';
import { Text } from 'react-native';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  uri?: string | null;
  // Accepts either, since callers size it with plain width/height.
  style?: StyleProp<ImageStyle & ViewStyle>;
  contentFit?: ImageContentFit;
  // Eyewear by default; brands and banners pass their own.
  placeholder?: IconName;
  iconSize?: number;
  // Bundled artwork to use when there is no remote image but we have something
  // genuinely representative (e.g. the gender tiles).
  fallbackSource?: ImageSourcePropType;
  // Shown instead of the icon when set. Used for brands, where initials identify
  // the brand far better than one generic icon repeated down the row.
  fallbackText?: string;
  // Seller and staff screens sit on dark surfaces.
  tone?: 'light' | 'dark';
}

// A missing image used to render as a bare coloured box, which reads as a broken
// screen. This shows a muted icon on a neutral tile instead, so the layout still
// looks deliberate.
export function Thumbnail({
  uri,
  style,
  contentFit = 'cover',
  placeholder = 'glasses',
  iconSize = 24,
  fallbackSource,
  fallbackText,
  tone = 'light',
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const source = uri ? { uri } : fallbackSource;

  if (source) {
    return (
      <Image
        source={source}
        style={style as StyleProp<ImageStyle>}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        transition={200}
      />
    );
  }

  return (
    <View
      style={[
        style as StyleProp<ViewStyle>,
        styles.placeholder,
        tone === 'dark' && styles.placeholderDark,
      ]}
    >
      {fallbackText ? (
        <Text style={[styles.monogram, { fontSize: Math.round(iconSize * 0.9) }]}>
          {fallbackText}
        </Text>
      ) : (
        <Icon
          name={placeholder}
          size={iconSize}
          color={tone === 'dark' ? colors.textInverseMuted : colors.textMuted}
        />
      )}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    placeholder: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.bgAlt,
    },
    placeholderDark: { backgroundColor: Colors.surfaceElevated },
    monogram: {
      fontFamily: Font.semibold,
      // Gold reads as deliberate branding rather than a failed image.
      color: c.accent,
      letterSpacing: 1,
    },
  });

import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Thumbnail } from '../ui/Thumbnail';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

export type BannerOverlay = 'none' | 'light' | 'medium' | 'heavy' | 'gradient';

interface Props {
  imageUrl?: string | null;
  height: number;
  overlay?: BannerOverlay;
  align?: 'center' | 'bottom';
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const overlayColor = (
  c: CustomerPalette,
): Record<Exclude<BannerOverlay, 'none' | 'gradient'>, string> => ({
  light: c.overlayLight,
  medium: c.overlayMedium,
  heavy: c.overlayHeavy,
});

export function FullBleedBanner({
  imageUrl,
  height,
  overlay = 'medium',
  align = 'center',
  children,
  style,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  return (
    <View style={[{ height }, styles.wrap, style]}>
      <Thumbnail uri={imageUrl} style={StyleSheet.absoluteFill} placeholder="image" iconSize={40} />

      {overlay === 'gradient' ? (
        <LinearGradient
          colors={[colors.transparent, colors.overlayHeavy]}
          style={StyleSheet.absoluteFill}
        />
      ) : overlay !== 'none' ? (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor(colors)[overlay] }]}
        />
      ) : null}

      {children && (
        <View style={[styles.content, align === 'bottom' ? styles.bottom : styles.centered]}>
          {children}
        </View>
      )}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    wrap: { width: '100%', overflow: 'hidden' },
    placeholder: { backgroundColor: c.bgAlt },
    content: {
      flex: 1,
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[6],
    },
    centered: { justifyContent: 'center', alignItems: 'center' },
    bottom: { justifyContent: 'flex-end' },
  });

import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Thumbnail } from '../ui/Thumbnail';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';

export type BannerOverlay = 'none' | 'light' | 'medium' | 'heavy' | 'gradient';

interface Props {
  imageUrl?: string | null;
  height: number;
  overlay?: BannerOverlay;
  align?: 'center' | 'bottom';
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const OVERLAY_COLOR: Record<Exclude<BannerOverlay, 'none' | 'gradient'>, string> = {
  light: CustomerColors.overlayLight,
  medium: CustomerColors.overlayMedium,
  heavy: CustomerColors.overlayHeavy,
};

export function FullBleedBanner({
  imageUrl,
  height,
  overlay = 'medium',
  align = 'center',
  children,
  style,
}: Props) {
  return (
    <View style={[{ height }, styles.wrap, style]}>
      <Thumbnail uri={imageUrl} style={StyleSheet.absoluteFill} placeholder="image" iconSize={40} />

      {overlay === 'gradient' ? (
        <LinearGradient
          colors={[CustomerColors.transparent, CustomerColors.overlayHeavy]}
          style={StyleSheet.absoluteFill}
        />
      ) : overlay !== 'none' ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: OVERLAY_COLOR[overlay] }]} />
      ) : null}

      {children && (
        <View style={[styles.content, align === 'bottom' ? styles.bottom : styles.centered]}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', overflow: 'hidden' },
  placeholder: { backgroundColor: CustomerColors.bgAlt },
  content: {
    flex: 1,
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingVertical: Spacing[6],
  },
  centered: { justifyContent: 'center', alignItems: 'center' },
  bottom: { justifyContent: 'flex-end' },
});

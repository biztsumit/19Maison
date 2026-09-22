import { Spacing } from '@/theme/spacing';
import { BlurView } from 'expo-blur';
import { createContext, useContext } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '../ui/Badge';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useTheme, useThemeColors, useThemedStyles } from '@/theme/theme-provider';

// Geometry measured off the Figma export (856x216 = @2x of a 428pt frame).
// Dividing each glyph's ink box in that render by the same glyph's ink box in the
// 90x90 source PNG gives the icon frame independently five times over: 29.3, 29.4,
// 29.6, 29.4, 30.0. Hence 30 — not the 24 the lucide icons were drawn at.
export const TAB_ICON_SIZE = 30;

// 30 icon + 4 gap + 16 label line, over 10/8 padding. The old 60pt bar left 44pt of
// content for a 50pt stack, which clipped the labels under OS font scaling.
export const TAB_BAR_HEIGHT = 70;

// The design's glyphs, not lucide's: Explore is an image-with-magnifier rather than
// a plain magnifier, and Cart is a trolley with a plus rather than a shopping bag.
// All five are pure black on transparent, so tintColor carries the active state.
const TAB_ICONS = {
  home: require('../../../../assets/images/tabIcons/home.png'),
  explore: require('../../../../assets/images/tabIcons/explore.png'),
  category: require('../../../../assets/images/tabIcons/category.png'),
  cart: require('../../../../assets/images/tabIcons/cart.png'),
  profile: require('../../../../assets/images/tabIcons/profile.png'),
} satisfies Record<string, ImageSourcePropType>;

export type TabIconName = keyof typeof TAB_ICONS;

// The bar floats over the content, so screens inside it need bottom room to scroll
// clear of it. CustomerScreen reads this; outside the tabs it stays 0.
export const TabBarInsetContext = createContext(0);

export const useTabBarInset = () => useContext(TabBarInsetContext);

// Semi-transparent, per the design: the exported bar reads a flat 254,254,254 where
// the page behind it is white but falls to 178,169,164 lower down, where content
// shows through. Real blur on iOS and on Android 12+; below that expo-blur renders
// the equivalent translucent fill, which keeps the labels legible either way.
export function TabBarBackground() {
  const { isDark } = useTheme();

  return (
    <BlurView
      intensity={100}
      tint={isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
      blurMethod="none"
      style={StyleSheet.absoluteFill}
    />
  );
}

interface TabIconProps {
  label: string;
  name: TabIconName;
  focused: boolean;
  badgeCount?: number;
}

export function TabBarIcon({ label, name, focused, badgeCount }: TabIconProps) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  // #D4AF37 is the exact gold in the export (212,175,55 across 972 pixels), and the
  // inactive glyphs are pure black rather than a muted grey.
  const tint = focused ? colors.accent : colors.text;

  return (
    <View style={styles.item}>
      <View>
        <Image source={TAB_ICONS[name]} style={styles.icon} tintColor={tint} resizeMode="contain" />
        {badgeCount !== undefined && <Badge count={badgeCount} style={styles.badge} />}
      </View>
      {/* The bar has a fixed height, so the label must not grow with the OS
          font setting and must not wrap. */}
      <Text
        variant="caption"
        style={[styles.label, { color: tint }]}
        allowFontScaling={false}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export function useTabBarStyle() {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return {
    bar: [
      styles.bar,
      {
        height: TAB_BAR_HEIGHT + insets.bottom,
        paddingBottom: insets.bottom + Spacing[2],
      },
    ],
    inset: TAB_BAR_HEIGHT + insets.bottom,
  };
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    bar: {
      // Absolute so the page shows through the translucent fill; without it the
      // navigator lays the screen out above the bar and there is nothing to see.
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: Spacing[2.5],
      backgroundColor: c.transparent,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      // A shadow would darken the page showing through the blur.
      elevation: 0,
    },
    item: { alignItems: 'center', gap: Spacing[1], width: 72 },
    icon: { width: TAB_ICON_SIZE, height: TAB_ICON_SIZE },
    badge: { position: 'absolute', top: -6, right: -10 },
    // 12pt in the export: the glyph cap height measures 8.5pt, and Poppins caps are
    // ~0.7em. The shared `caption` preset is 10pt, so the size is set here.
    label: { fontSize: 12, lineHeight: 16, textAlign: 'center' },
  });

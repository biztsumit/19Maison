import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors } from '@/theme/theme-provider';

export type SectionBackground = 'white' | 'offWhite' | 'dark' | 'gold';

interface Props {
  background?: SectionBackground;
  gutter?: boolean;
  paddingV?: number;
  gap?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

// 'dark' and 'gold' are brand contrast bands: they stay dark and gold in both
// schemes. 'white' and 'offWhite' are the page surfaces and do follow the scheme.
const backgroundFor = (c: CustomerPalette): Record<SectionBackground, string> => ({
  white: c.bg,
  offWhite: c.bgAlt,
  dark: c.bgDark,
  gold: c.bgGold,
});

export function Section({
  background = 'white',
  gutter = true,
  paddingV = CustomerLayout.sectionPaddingV,
  gap = CustomerLayout.sectionGap,
  children,
  style,
}: Props) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        { backgroundColor: backgroundFor(colors)[background], paddingVertical: paddingV, gap },
        gutter && styles.gutter,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  gutter: { paddingHorizontal: CustomerLayout.screenPaddingH },
});

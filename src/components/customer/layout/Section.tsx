import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { CustomerColors, CustomerLayout } from '@/theme/customer';

export type SectionBackground = 'white' | 'offWhite' | 'dark' | 'gold';

interface Props {
  background?: SectionBackground;
  gutter?: boolean;
  paddingV?: number;
  gap?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const BACKGROUNDS: Record<SectionBackground, string> = {
  white: CustomerColors.bg,
  offWhite: CustomerColors.bgAlt,
  dark: CustomerColors.bgDark,
  gold: CustomerColors.bgGold,
};

export function Section({
  background = 'white',
  gutter = true,
  paddingV = CustomerLayout.sectionPaddingV,
  gap = CustomerLayout.sectionGap,
  children,
  style,
}: Props) {
  return (
    <View
      style={[
        { backgroundColor: BACKGROUNDS[background], paddingVertical: paddingV, gap },
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

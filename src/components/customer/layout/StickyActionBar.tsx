import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomerLayout } from '@/theme/customer';
import { LightShadows } from '@/theme/shadows';
import { Spacing } from '@/theme/spacing';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  direction?: 'row' | 'column';
  children: ReactNode;
}

export function StickyActionBar({ direction = 'row', children }: Props) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { flexDirection: direction, paddingBottom: Math.max(insets.bottom, Spacing[3]) },
      ]}
    >
      {children}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    bar: {
      gap: Spacing[3],
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingTop: Spacing[3],
      backgroundColor: c.bg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      ...LightShadows.bar,
    },
  });

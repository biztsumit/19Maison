import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { LightShadows } from '@/theme/shadows';
import { Spacing } from '@/theme/spacing';

interface Props {
  direction?: 'row' | 'column';
  children: ReactNode;
}

export function StickyActionBar({ direction = 'row', children }: Props) {
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

const styles = StyleSheet.create({
  bar: {
    gap: Spacing[3],
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingTop: Spacing[3],
    backgroundColor: CustomerColors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CustomerColors.border,
    ...LightShadows.bar,
  },
});

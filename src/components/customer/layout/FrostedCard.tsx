import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';

interface Props {
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

// The web's signature motif is a blurred caption chip over full-bleed imagery.
// Real glass where the platform supports it, a translucent fill everywhere else.
export function FrostedCard({ tone = 'light', align = 'left', children, style }: Props) {
  const content = [styles.card, align === 'center' && styles.center, style];

  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme={tone === 'dark' ? 'dark' : 'light'}
        style={content}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View style={[content, tone === 'dark' ? styles.fallbackDark : styles.fallbackLight]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing[5],
    gap: Spacing[2],
    borderRadius: CustomerLayout.cardRadius,
    overflow: 'hidden',
  },
  center: { alignItems: 'center' },
  fallbackLight: { backgroundColor: CustomerColors.frostedLight },
  fallbackDark: { backgroundColor: CustomerColors.frostedDark },
});

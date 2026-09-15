import { Text as RNText, StyleSheet } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';
import { Colors } from '@/theme/colors';
import { TextStyles } from '@/theme/typography';

type Variant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headingLarge'
  | 'headingMedium'
  | 'headingSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'label'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'price'
  | 'priceSmall';

type ColorVariant = 'primary' | 'secondary' | 'muted' | 'gold' | 'error' | 'success';

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: ColorVariant;
}

export function Text({ variant = 'body', color = 'primary', style, ...rest }: TextProps) {
  return (
    <RNText
      style={[styles.base, TextStyles[variant], styles[`color_${color}`], style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: Colors.textPrimary,
  },
  color_primary: { color: Colors.textPrimary },
  color_secondary: { color: Colors.textSecondary },
  color_muted: { color: Colors.textMuted },
  color_gold: { color: Colors.gold },
  color_error: { color: Colors.error },
  color_success: { color: Colors.success },
});

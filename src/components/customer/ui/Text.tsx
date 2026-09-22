import { Text as RNText, StyleSheet } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';
import type { CustomerTextVariant } from '@/theme/customer';
import type { CustomerPalette } from '@/theme/palette';
import { useTheme, useThemedStyles } from '@/theme/theme-provider';

export type TextTone =
  | 'default'
  | 'muted'
  | 'inverse'
  | 'inverseMuted'
  | 'onInverse'
  | 'gold'
  | 'error'
  | 'success';

interface Props extends RNTextProps {
  variant?: CustomerTextVariant;
  tone?: TextTone;
}

// Every preset already carries a colour for the active scheme, so the default is
// readable on whichever surface the page is painting. `tone` only overrides it for
// on-image/on-dark use, where the background does not follow the scheme.
export function Text({ variant = 'body', tone, style, ...rest }: Props) {
  const { text } = useTheme();
  const toneStyles = useThemedStyles(makeToneStyles);

  return <RNText style={[text[variant], tone && toneStyles[tone], style]} {...rest} />;
}

const makeToneStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    default: { color: c.text },
    muted: { color: c.textMuted },
    inverse: { color: c.textInverse },
    onInverse: { color: c.onInverse },
    inverseMuted: { color: c.textInverseMuted },
    gold: { color: c.accent },
    error: { color: c.error },
    success: { color: c.success },
  });

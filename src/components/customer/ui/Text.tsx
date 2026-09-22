import { Text as RNText, StyleSheet } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';
import { CustomerColors, CustomerText } from '@/theme/customer';
import type { CustomerTextVariant } from '@/theme/customer';

export type TextTone =
  | 'default'
  | 'muted'
  | 'inverse'
  | 'inverseMuted'
  | 'gold'
  | 'error'
  | 'success';

interface Props extends RNTextProps {
  variant?: CustomerTextVariant;
  tone?: TextTone;
}

// Every CustomerText preset already carries a colour, so the default is readable
// on the light customer surfaces. `tone` only overrides it for on-image/on-dark use.
export function Text({ variant = 'body', tone, style, ...rest }: Props) {
  return <RNText style={[CustomerText[variant], tone && toneStyles[tone], style]} {...rest} />;
}

const toneStyles = StyleSheet.create({
  default: { color: CustomerColors.text },
  muted: { color: CustomerColors.textMuted },
  inverse: { color: CustomerColors.textInverse },
  inverseMuted: { color: CustomerColors.textInverseMuted },
  gold: { color: CustomerColors.accent },
  error: { color: CustomerColors.error },
  success: { color: CustomerColors.success },
});

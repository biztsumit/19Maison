import { Pressable, StyleSheet } from 'react-native';
import { CustomerText } from '@/theme/customer';
import type { CustomerPalette } from '@/theme/palette';
import { useTheme, useThemedStyles } from '@/theme/theme-provider';
import { Spacing } from '@/theme/spacing';
import { FontSize } from '@/theme/typography';
import { Text } from '../ui/Text';

interface Props {
  label: string;
  onPress: () => void;
  tone?: 'dark' | 'light';
}

// `tone="light"` is the variant that sits on a dark band, so it is pinned to the
// inverse colours in both schemes rather than following the page.
function invertedColor(c: CustomerPalette, tone: 'dark' | 'light', pressed: boolean): string {
  if (tone === 'light') return pressed ? c.bgDark : c.textInverse;
  return pressed ? c.onInverse : c.text;
}

// Web inverts this on hover; on touch the pressed state carries that affordance.
export function SectionCta({ label, onPress, tone = 'dark' }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.cta,
        tone === 'light' ? styles.light : styles.dark,
        pressed && (tone === 'light' ? styles.pressedLight : styles.pressedDark),
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            CustomerText.ctaLabel,
            styles.label,
            { color: invertedColor(colors, tone, pressed) },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    cta: {
      alignSelf: 'flex-start',
      borderWidth: 1,
      paddingHorizontal: Spacing[4],
      paddingVertical: Spacing[2.5],
    },
    dark: { borderColor: c.borderStrong },
    light: { borderColor: c.textInverse },
    pressedDark: { backgroundColor: c.inverseSurface },
    pressedLight: { backgroundColor: c.textInverse },
    label: { fontSize: FontSize.sm },
  });

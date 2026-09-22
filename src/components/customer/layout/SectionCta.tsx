import { Pressable, StyleSheet } from 'react-native';
import { CustomerColors, CustomerText } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { FontSize } from '@/theme/typography';
import { Text } from '../ui/Text';

interface Props {
  label: string;
  onPress: () => void;
  tone?: 'dark' | 'light';
}

// Web inverts this on hover; on touch the pressed state carries that affordance.
export function SectionCta({ label, onPress, tone = 'dark' }: Props) {
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
          style={[CustomerText.ctaLabel, styles.label, { color: invertedColor(tone, pressed) }]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function invertedColor(tone: 'dark' | 'light', pressed: boolean): string {
  if (tone === 'light') return pressed ? CustomerColors.text : CustomerColors.textInverse;
  return pressed ? CustomerColors.textInverse : CustomerColors.text;
}

const styles = StyleSheet.create({
  cta: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2.5],
  },
  dark: { borderColor: CustomerColors.borderStrong },
  light: { borderColor: CustomerColors.textInverse },
  pressedDark: { backgroundColor: CustomerColors.bgDark },
  pressedLight: { backgroundColor: CustomerColors.bg },
  label: { fontSize: FontSize.sm },
});

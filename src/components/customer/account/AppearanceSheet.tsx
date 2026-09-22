import { Pressable, StyleSheet, View } from 'react-native';
import type { CustomerPalette } from '@/theme/palette';
import { Spacing } from '@/theme/spacing';
import { THEME_MODES, useTheme, useThemedStyles } from '@/theme/theme-provider';
import type { ThemeMode } from '@/theme/theme-provider';
import { BottomSheet } from '../ui/BottomSheet';
import { SelectionBox } from '../ui/SelectionBox';
import { Text } from '../ui/Text';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const COPY: Record<ThemeMode, { label: string; hint: string }> = {
  system: { label: 'System', hint: 'Match your device setting' },
  light: { label: 'Light', hint: 'Always use the light theme' },
  dark: { label: 'Dark', hint: 'Always use the dark theme' },
};

export function appearanceLabel(mode: ThemeMode): string {
  return COPY[mode].label;
}

export function AppearanceSheet({ visible, onClose }: Props) {
  const styles = useThemedStyles(makeStyles);
  const { mode, setMode } = useTheme();

  // Applied immediately rather than on a confirm: the whole screen is the preview.
  const choose = (next: ThemeMode) => {
    setMode(next);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Appearance">
      <View style={styles.list}>
        {THEME_MODES.map(option => (
          <Pressable
            key={option}
            onPress={() => choose(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected: mode === option }}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowText}>
              <Text variant="cardTitle">{COPY[option].label}</Text>
              <Text variant="bodySmallMuted">{COPY[option].hint}</Text>
            </View>
            <SelectionBox selected={mode === option} size={22} />
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    list: { paddingBottom: Spacing[4] },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing[4],
      paddingHorizontal: Spacing[6],
      paddingVertical: Spacing[4],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    pressed: { opacity: 0.7 },
    rowText: { flex: 1, gap: Spacing[0.5] },
  });

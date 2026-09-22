import { Pressable, StyleSheet, View } from 'react-native';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  count?: number;
  disabled?: boolean;
}

export function Checkbox({ checked, onToggle, label, count, disabled = false }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Icon name="check" size={14} color={colors.onInverse} strokeWidth={3} />}
      </View>
      {label && (
        <Text variant="body" style={styles.label}>
          {label}
          {count !== undefined ? ` (${count})` : ''}
        </Text>
      )}
    </Pressable>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing[3],
      paddingVertical: Spacing[2],
    },
    pressed: { opacity: 0.7 },
    disabled: { opacity: 0.4 },
    box: {
      width: 20,
      height: 20,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: c.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxChecked: { backgroundColor: c.inverseSurface },
    label: { flex: 1 },
  });

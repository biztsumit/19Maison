import { Pressable, StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  hint?: string;
  disabled?: boolean;
}

export function QuantityStepper({ value, onChange, min = 1, max, hint, disabled = false }: Props) {
  const styles = useThemedStyles(makeStyles);
  const atMax = max !== undefined && value >= max;
  const atMin = value <= min;

  return (
    <View style={styles.wrap}>
      <View style={styles.box}>
        <Pressable
          onPress={() => onChange(value - 1)}
          disabled={disabled || atMin}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Decrease quantity"
          style={[styles.btn, (disabled || atMin) && styles.btnDisabled]}
        >
          <Icon name="minus" size={16} />
        </Pressable>

        <Text variant="cardTitle" style={styles.value}>
          {value}
        </Text>

        <Pressable
          onPress={() => onChange(value + 1)}
          disabled={disabled || atMax}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Increase quantity"
          style={[styles.btn, (disabled || atMax) && styles.btnDisabled]}
        >
          <Icon name="plus" size={16} />
        </Pressable>
      </View>

      {atMax && hint && <Text variant="caption">{hint}</Text>}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    wrap: { gap: Spacing[1] },
    box: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      alignSelf: 'flex-start',
    },
    btn: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[2.5] },
    btnDisabled: { opacity: 0.3 },
    value: { minWidth: 32, textAlign: 'center' },
  });

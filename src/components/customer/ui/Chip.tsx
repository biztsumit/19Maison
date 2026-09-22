import { Pressable, StyleSheet } from 'react-native';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Text } from './Text';
import { Icon } from './Icon';
import { FontSize } from '@/theme/typography';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
}

export function Chip({ label, selected = false, onPress, onRemove }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text variant="bodySmall" tone={selected ? 'onInverse' : 'default'}>
        {label}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} accessibilityLabel={`Remove ${label}`}>
          <Icon
            name="close"
            size={FontSize.sm}
            color={selected ? colors.onInverse : colors.textMuted}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing[2],
      paddingHorizontal: Spacing[3],
      paddingVertical: Spacing[2],
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.bg,
    },
    selected: { backgroundColor: c.inverseSurface, borderColor: c.inverseSurface },
    pressed: { opacity: 0.7 },
  });

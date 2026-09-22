import { Pressable, StyleSheet } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Text } from './Text';
import { Icon } from './Icon';
import { FontSize } from '@/theme/typography';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
}

export function Chip({ label, selected = false, onPress, onRemove }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text variant="bodySmall" tone={selected ? 'inverse' : 'default'}>
        {label}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} accessibilityLabel={`Remove ${label}`}>
          <Icon
            name="close"
            size={FontSize.sm}
            color={selected ? CustomerColors.textInverse : CustomerColors.textMuted}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: CustomerColors.border,
    backgroundColor: CustomerColors.bg,
  },
  selected: { backgroundColor: CustomerColors.bgDark, borderColor: CustomerColors.bgDark },
  pressed: { opacity: 0.7 },
});

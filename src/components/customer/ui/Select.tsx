import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { BottomSheet } from './BottomSheet';
import { Icon } from './Icon';
import { Text } from './Text';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface Props<T extends string = string> {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  title?: string;
  label?: string;
  disabled?: boolean;
}

// A bottom sheet on both platforms rather than ActionSheetIOS/Picker: platform-split
// UI reads as a regression in a brand-led app.
export function Select<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select',
  title = 'Select',
  label,
  disabled = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <View style={styles.wrap}>
      {label && <Text variant="inputLabel">{label}</Text>}

      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text variant={selected ? 'body' : 'bodyMuted'} numberOfLines={1} style={styles.flex}>
          {selected?.label ?? placeholder}
        </Text>
        <Icon name="chevron-down" size={18} color={CustomerColors.textMuted} />
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)} title={title} snap="large">
        <ScrollView contentContainerStyle={styles.list}>
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [styles.option, pressed && styles.pressed]}
              >
                <Text variant="body" style={styles.flex}>
                  {option.label}
                </Text>
                {isSelected && <Icon name="check" size={18} color={CustomerColors.accent} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing[1.5] },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    height: CustomerLayout.controlHeight,
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderColor: CustomerColors.border,
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
  flex: { flex: 1 },
  list: { paddingHorizontal: CustomerLayout.screenPaddingH, paddingBottom: Spacing[4] },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CustomerColors.border,
  },
});

import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { BottomSheet } from '../ui/BottomSheet';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import type { SortOption } from './constants';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  visible: boolean;
  options: SortOption[];
  value: SortOption | null;
  onChange: (option: SortOption) => void;
  onClose: () => void;
}

export function SortSheet({ visible, options, value, onChange, onClose }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Sort by" snap="large">
      <ScrollView contentContainerStyle={styles.list}>
        {options.map(option => {
          const selected = value?.label === option.label;
          return (
            <Pressable
              key={option.label}
              onPress={() => {
                onChange(option);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <Text variant="body" style={styles.flex}>
                {option.label}
              </Text>
              {selected && <Icon name="check" size={18} color={colors.accent} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    list: { paddingHorizontal: CustomerLayout.screenPaddingH, paddingBottom: Spacing[4] },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing[3],
      paddingVertical: Spacing[4],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    pressed: { opacity: 0.7 },
    flex: { flex: 1 },
  });

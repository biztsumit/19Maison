import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';

export interface SizeOption {
  id: string;
  label: string;
  available: boolean;
}

interface Props {
  sizes: SizeOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SizeSelector({ sizes, selectedId, onSelect }: Props) {
  if (sizes.length === 0) return null;
  const selected = sizes.find(s => s.id === selectedId);

  return (
    <View style={styles.wrap}>
      <Text variant="cardTitle">Size{selected ? `: ${selected.label}` : ''}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {sizes.map(size => {
            const isSelected = size.id === selectedId;
            return (
              <Pressable
                key={size.id}
                onPress={() => onSelect(size.id)}
                disabled={!size.available}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled: !size.available }}
                style={[
                  styles.box,
                  isSelected && styles.selected,
                  !size.available && styles.unavailable,
                ]}
              >
                <Text
                  variant="bodySmall"
                  tone={size.available ? 'default' : 'muted'}
                  style={!size.available && styles.struck}
                >
                  {size.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing[3] },
  row: { flexDirection: 'row', gap: Spacing[3] },
  box: {
    minWidth: CustomerLayout.swatchSize,
    height: CustomerLayout.swatchSize,
    paddingHorizontal: Spacing[2],
    borderWidth: 2,
    borderColor: CustomerColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { borderColor: CustomerColors.accent },
  unavailable: { opacity: 0.5 },
  struck: { textDecorationLine: 'line-through' },
});

import { Pressable, StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { formatAddressLines } from '@/utils/formatters';
import type { Address } from '@/types/user.types';
import { SelectionBox } from '../ui/SelectionBox';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  address: Address;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function AddressOption({ address, index, selected, onSelect, disabled }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      onPress={() => onSelect(address.id)}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      style={[styles.card, selected && styles.selected, disabled && styles.disabled]}
    >
      <View style={styles.body}>
        <Text variant="cardBrand">
          {address.isDefault ? 'Default address' : `Address ${index + 1}`}
        </Text>
        {formatAddressLines(address).map(line => (
          <Text key={line} variant="bodySmallMuted">
            {line}
          </Text>
        ))}
      </View>
      <SelectionBox selected={selected} />
    </Pressable>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing[3],
      padding: Spacing[4],
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.bg,
    },
    selected: { borderColor: c.borderStrong },
    disabled: { opacity: 0.5 },
    body: { flex: 1, gap: Spacing[0.5] },
  });

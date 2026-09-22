import { Pressable, StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { formatAddressLines } from '@/utils/formatters';
import type { Address } from '@/types/user.types';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  address: Address;
  index?: number;
  onEdit?: (address: Address) => void;
  onDelete?: (address: Address) => void;
}

export function AddressCard({ address, index, onEdit, onDelete }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const label = address.isDefault ? 'Default address' : `Address ${(index ?? 0) + 1}`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text variant="cardBrand">{label}</Text>
        <View style={styles.actions}>
          {onEdit && (
            <Pressable
              onPress={() => onEdit(address)}
              hitSlop={8}
              accessibilityLabel="Edit address"
            >
              <Icon name="pencil" size={18} color={colors.textMuted} />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              onPress={() => onDelete(address)}
              hitSlop={8}
              accessibilityLabel="Delete address"
            >
              <Icon name="trash" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <View>
        {formatAddressLines(address).map(line => (
          <Text key={line} variant="bodySmallMuted">
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    card: {
      gap: Spacing[3],
      padding: Spacing[4],
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.bg,
    },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    actions: { flexDirection: 'row', gap: Spacing[4] },
  });

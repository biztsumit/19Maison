import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { formatPrice } from '@/utils/formatters';
import { Text } from './Text';

interface Props {
  label: string;
  value: number | string;
  emphasis?: 'normal' | 'strong' | 'total';
  muted?: boolean;
}

export function PriceRow({ label, value, emphasis = 'normal', muted = false }: Props) {
  const variant = emphasis === 'total' ? 'cardPrice' : 'body';
  const display = typeof value === 'number' ? formatPrice(value) : value;

  return (
    <View style={[styles.row, emphasis === 'total' && styles.totalRow]}>
      <Text variant={variant} tone={muted ? 'muted' : 'default'}>
        {label}
      </Text>
      <Text variant={variant} tone={muted ? 'muted' : 'default'}>
        {display}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[1.5],
  },
  totalRow: { paddingVertical: Spacing[2.5] },
});

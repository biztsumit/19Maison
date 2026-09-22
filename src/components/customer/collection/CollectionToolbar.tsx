import { Pressable, StyleSheet, View } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  onFilterPress: () => void;
  onSortPress: () => void;
  activeFilterCount: number;
  sortLabel?: string;
  totalCount?: number;
}

export function CollectionToolbar({
  onFilterPress,
  onSortPress,
  activeFilterCount,
  sortLabel = 'Sort',
  totalCount,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.bar}>
      <Pressable
        onPress={onFilterPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Icon name="sliders" size={18} />
        <Text variant="body">Filter</Text>
        <Badge count={activeFilterCount} />
      </Pressable>

      {totalCount !== undefined && (
        <Text variant="bodySmallMuted">
          {totalCount} {totalCount === 1 ? 'product' : 'products'}
        </Text>
      )}

      <Pressable
        onPress={onSortPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Text variant="body" numberOfLines={1}>
          {sortLabel}
        </Text>
        <Icon name="chevron-down" size={18} />
      </Pressable>
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing[3],
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[3],
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    action: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
    pressed: { opacity: 0.6 },
  });

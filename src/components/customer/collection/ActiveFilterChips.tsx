import { ScrollView, StyleSheet } from 'react-native';
import type { FilterGroup } from '@/types/product.types';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Chip } from '../ui/Chip';
import type { ActiveFilters } from '@/hooks/useCollectionFilters';

interface Props {
  active: ActiveFilters;
  groups: FilterGroup[];
  onRemove: (groupId: string, value: string) => void;
  onClearAll: () => void;
}

// Not a web pattern: on mobile the filter drawer is hidden, so applied filters
// need to stay visible on the results screen.
export function ActiveFilterChips({ active, groups, onRemove, onClearAll }: Props) {
  const entries = Object.entries(active).flatMap(([groupId, values]) =>
    values.map(value => ({ groupId, value })),
  );

  if (entries.length === 0) return null;

  const labelFor = (groupId: string, value: string) =>
    groups.find(group => group.id === groupId)?.options.find(option => option.value === value)
      ?.label ?? value;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {entries.map(({ groupId, value }) => (
        <Chip
          key={`${groupId}:${value}`}
          label={labelFor(groupId, value)}
          onRemove={() => onRemove(groupId, value)}
        />
      ))}
      {entries.length > 1 && <Chip label="Clear all" selected onPress={onClearAll} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing[2],
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingVertical: Spacing[3],
  },
});

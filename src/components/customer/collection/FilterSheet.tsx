import { StyleSheet, View } from 'react-native';
import type { FilterGroup } from '@/types/product.types';
import { Spacing } from '@/theme/spacing';
import { Accordion } from '../ui/Accordion';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Modal } from '../ui/Modal';
import { Text } from '../ui/Text';
import type { ActiveFilters } from '@/hooks/useCollectionFilters';

interface Props {
  visible: boolean;
  groups: FilterGroup[];
  draft: ActiveFilters;
  onToggle: (groupId: string, value: string) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

// Full-screen rather than the web's side drawer: a dozen filter groups with
// nested option lists need the vertical room at phone width.
export function FilterSheet({
  visible,
  groups,
  draft,
  onToggle,
  onApply,
  onReset,
  onClose,
}: Props) {
  const withOptions = groups.filter(group => group.options.length > 0);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Filter"
      variant="fullscreen"
      footer={
        <>
          <Button
            label="Reset"
            variant="outline"
            onPress={() => {
              onReset();
              onClose();
            }}
            style={styles.footerButton}
          />
          <Button
            label="Apply"
            variant="solid"
            onPress={() => {
              onApply();
              onClose();
            }}
            style={styles.footerButton}
          />
        </>
      }
    >
      {withOptions.length === 0 ? (
        <Text variant="bodyMuted">No filters available.</Text>
      ) : (
        withOptions.map(group => (
          <Accordion key={group.id} label={group.label}>
            <View style={styles.options}>
              {group.options.map(option => (
                <Checkbox
                  key={option.value}
                  checked={(draft[group.id] ?? []).includes(option.value)}
                  onToggle={() => onToggle(group.id, option.value)}
                  label={option.label}
                  count={option.count}
                />
              ))}
            </View>
          </Accordion>
        ))
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  options: { gap: Spacing[1] },
  footerButton: { flex: 1 },
});

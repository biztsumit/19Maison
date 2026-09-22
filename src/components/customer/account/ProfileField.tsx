import { StyleSheet, View } from 'react-native';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';

interface Props {
  label: string;
  value?: string;
}

// Read-only display box, matching the web account page.
export function ProfileField({ label, value }: Props) {
  return (
    <View style={styles.wrap}>
      <Text variant="inputLabel">{label}</Text>
      <View style={styles.box}>
        <Text variant={value ? 'body' : 'bodyMuted'}>{value || 'Not provided'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing[1.5] },
  box: {
    justifyContent: 'center',
    minHeight: CustomerLayout.controlHeight,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderWidth: 1,
    borderColor: CustomerColors.border,
  },
});

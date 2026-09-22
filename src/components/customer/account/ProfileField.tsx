import { StyleSheet, View } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  label: string;
  value?: string;
}

// Read-only display box, matching the web account page.
export function ProfileField({ label, value }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.wrap}>
      <Text variant="inputLabel">{label}</Text>
      <View style={styles.box}>
        <Text variant={value ? 'body' : 'bodyMuted'}>{value || 'Not provided'}</Text>
      </View>
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    wrap: { gap: Spacing[1.5] },
    box: {
      justifyContent: 'center',
      minHeight: CustomerLayout.controlHeight,
      paddingHorizontal: Spacing[4],
      paddingVertical: Spacing[3],
      borderWidth: 1,
      borderColor: c.border,
    },
  });

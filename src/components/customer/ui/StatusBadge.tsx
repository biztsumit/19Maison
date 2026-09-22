import { StyleSheet, View } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Text } from './Text';

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface Props {
  label: string;
  tone?: StatusTone;
}

const DOT_COLOR: Record<StatusTone, string> = {
  success: CustomerColors.success,
  warning: CustomerColors.warning,
  error: CustomerColors.error,
  info: CustomerColors.info,
  neutral: CustomerColors.textMuted,
};

export function StatusBadge({ label, tone = 'neutral' }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: DOT_COLOR[tone] }]} />
      <Text variant="bodySmall">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  dot: { width: 8, height: 8, borderRadius: BorderRadius.full },
});

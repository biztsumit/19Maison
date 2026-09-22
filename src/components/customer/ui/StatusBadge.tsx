import { StyleSheet, View } from 'react-native';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors } from '@/theme/theme-provider';

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface Props {
  label: string;
  tone?: StatusTone;
}

const dotColor = (c: CustomerPalette): Record<StatusTone, string> => ({
  success: c.success,
  warning: c.warning,
  error: c.error,
  info: c.info,
  neutral: c.textMuted,
});

export function StatusBadge({ label, tone = 'neutral' }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: dotColor(colors)[tone] }]} />
      <Text variant="bodySmall">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  dot: { width: 8, height: 8, borderRadius: BorderRadius.full },
});

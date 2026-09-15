import { View, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Text } from './Text';

interface BadgeProps {
  count: number;
  style?: ViewStyle;
  max?: number;
}

export function Badge({ count, style, max = 99 }: BadgeProps) {
  if (count <= 0) return null;
  const label = count > max ? `${max}+` : String(count);

  return (
    <View style={[styles.badge, style]}>
      <Text variant="caption" style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    paddingHorizontal: Spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
});

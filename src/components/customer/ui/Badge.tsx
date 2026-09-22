import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { FontSize } from '@/theme/typography';
import { Text } from './Text';

interface Props {
  count: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ count, max = 99, style }: Props) {
  if (count <= 0) return null;
  return (
    <View style={[styles.badge, style]}>
      <Text variant="caption" style={styles.label}>
        {count > max ? `${max}+` : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: Spacing[1],
    borderRadius: BorderRadius.full,
    backgroundColor: CustomerColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: CustomerColors.textInverse,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * 1.4,
  },
});

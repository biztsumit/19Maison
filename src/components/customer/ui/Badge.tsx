import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { FontSize } from '@/theme/typography';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  count: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ count, max = 99, style }: Props) {
  const styles = useThemedStyles(makeStyles);
  if (count <= 0) return null;
  return (
    <View style={[styles.badge, style]}>
      <Text variant="caption" style={styles.label}>
        {count > max ? `${max}+` : count}
      </Text>
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    badge: {
      minWidth: 18,
      height: 18,
      paddingHorizontal: Spacing[1],
      borderRadius: BorderRadius.full,
      backgroundColor: c.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      color: c.textInverse,
      fontSize: FontSize.xs,
      lineHeight: FontSize.xs * 1.4,
    },
  });

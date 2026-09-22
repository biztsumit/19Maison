import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import { PRODUCT_TRUST_BADGES } from '../home/constants';
import type { TrustBadge } from '../home/constants';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  badges?: TrustBadge[];
}

export function TrustBadgeRow({ badges = PRODUCT_TRUST_BADGES }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  return (
    <View style={styles.row}>
      {badges.map(badge => (
        <View key={badge.key} style={styles.cell}>
          <Icon name={badge.icon} size={22} color={colors.text} />
          <Text variant="caption" style={styles.center}>
            {badge.title}
          </Text>
          <Text variant="caption" style={styles.center}>
            {badge.description}
          </Text>
        </View>
      ))}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: Spacing[2] },
    cell: {
      flex: 1,
      alignItems: 'center',
      gap: Spacing[1],
      padding: Spacing[3],
      backgroundColor: c.bgAlt,
    },
    center: { textAlign: 'center' },
  });

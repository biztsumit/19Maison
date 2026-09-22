import { StyleSheet, View } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import { PRODUCT_TRUST_BADGES } from '../home/constants';
import type { TrustBadge } from '../home/constants';

interface Props {
  badges?: TrustBadge[];
}

export function TrustBadgeRow({ badges = PRODUCT_TRUST_BADGES }: Props) {
  return (
    <View style={styles.row}>
      {badges.map(badge => (
        <View key={badge.key} style={styles.cell}>
          <Icon name={badge.icon} size={22} color={CustomerColors.text} />
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

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing[2] },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing[1],
    padding: Spacing[3],
    backgroundColor: CustomerColors.bgAlt,
  },
  center: { textAlign: 'center' },
});

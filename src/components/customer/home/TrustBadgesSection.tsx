import { StyleSheet, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import { Section } from '../layout/Section';
import { TRUST_BADGES } from './constants';
import type { TrustBadge } from './constants';

interface Props {
  badges?: TrustBadge[];
  columns?: number;
  tone?: 'dark' | 'light';
}

export function TrustBadgesSection({ badges = TRUST_BADGES, columns = 2, tone = 'dark' }: Props) {
  const onDark = tone === 'dark';
  const basis: DimensionValue = `${100 / columns}%`;

  return (
    <Section background={onDark ? 'dark' : 'white'}>
      <View style={styles.grid}>
        {badges.map(badge => (
          <View key={badge.key} style={[styles.cell, { flexBasis: basis }]}>
            <Icon
              name={badge.icon}
              size={26}
              color={onDark ? CustomerColors.accent : CustomerColors.text}
            />
            <Text variant="cardTitle" tone={onDark ? 'inverse' : 'default'}>
              {badge.title}
            </Text>
            <Text variant="bodySmall" tone={onDark ? 'inverseMuted' : 'muted'}>
              {badge.description}
            </Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: Spacing[6] },
  cell: { gap: Spacing[2], paddingRight: Spacing[4] },
});

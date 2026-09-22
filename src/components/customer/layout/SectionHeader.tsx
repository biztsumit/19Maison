import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';
import { SectionCta } from './SectionCta';

interface Props {
  title: string;
  onDark?: boolean;
  cta?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, onDark = false, cta }: Props) {
  return (
    <View style={styles.row}>
      <Text variant={onDark ? 'sectionHeadingOnDark' : 'sectionHeading'} style={styles.title}>
        {title}
      </Text>
      {cta && (
        <SectionCta label={cta.label} onPress={cta.onPress} tone={onDark ? 'light' : 'dark'} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[3],
  },
  title: { flexShrink: 1 },
});

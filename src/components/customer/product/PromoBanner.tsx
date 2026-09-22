import { StyleSheet, View } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { CopyButton } from '../ui/CopyButton';
import { Text } from '../ui/Text';

interface Props {
  code: string;
  description: string;
}

export function PromoBanner({ code, description }: Props) {
  return (
    <View style={styles.banner}>
      <View style={styles.text}>
        <Text variant="cardTitle">{code}</Text>
        <Text variant="bodySmall">{description}</Text>
      </View>
      <CopyButton value={code} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[3],
    padding: Spacing[4],
    backgroundColor: CustomerColors.accentMuted,
  },
  text: { flex: 1, gap: Spacing[0.5] },
});

import { StyleSheet, View } from 'react-native';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';

interface Props {
  text?: string;
}

export function FooterBar({
  text = `© ${new Date().getFullYear()} 19 Maison. All rights reserved.`,
}: Props) {
  return (
    <View style={styles.bar}>
      <Text variant="caption" tone="inverseMuted" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: CustomerColors.bgDark,
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingVertical: Spacing[6],
  },
  text: { textAlign: 'center' },
});

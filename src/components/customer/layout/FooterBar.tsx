import { StyleSheet, View } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  text?: string;
}

export function FooterBar({
  text = `© ${new Date().getFullYear()} 19 Maison. All rights reserved.`,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.bar}>
      <Text variant="caption" tone="inverseMuted" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    bar: {
      backgroundColor: c.bgDark,
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[6],
    },
    text: { textAlign: 'center' },
  });

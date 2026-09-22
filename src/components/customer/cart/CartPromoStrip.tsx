import { StyleSheet, View } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  message?: string;
}

export function CartPromoStrip({
  message = 'FREE SHIPPING UNLOCKED - COMPLIMENTARY TRAVEL CASE WITH 3+ PAIRS',
}: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.strip}>
      <Text variant="caption" style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    strip: {
      backgroundColor: c.bgGold,
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[3],
    },
    text: { textAlign: 'center', color: c.text },
  });

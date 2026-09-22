import { StyleSheet, View } from 'react-native';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';

interface Props {
  message?: string;
}

export function CartPromoStrip({
  message = 'FREE SHIPPING UNLOCKED - COMPLIMENTARY TRAVEL CASE WITH 3+ PAIRS',
}: Props) {
  return (
    <View style={styles.strip}>
      <Text variant="caption" style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    backgroundColor: CustomerColors.bgGold,
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingVertical: Spacing[3],
  },
  text: { textAlign: 'center', color: CustomerColors.text },
});

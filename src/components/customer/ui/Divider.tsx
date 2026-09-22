import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { CustomerColors } from '@/theme/customer';

interface Props {
  vertical?: boolean;
  inset?: number;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ vertical = false, inset = 0, style }: Props) {
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        vertical ? { marginVertical: inset } : { marginHorizontal: inset },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: { height: StyleSheet.hairlineWidth, backgroundColor: CustomerColors.border },
  vertical: { width: StyleSheet.hairlineWidth, backgroundColor: CustomerColors.border },
});

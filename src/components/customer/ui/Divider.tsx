import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  vertical?: boolean;
  inset?: number;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ vertical = false, inset = 0, style }: Props) {
  const styles = useThemedStyles(makeStyles);
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

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    horizontal: { height: StyleSheet.hairlineWidth, backgroundColor: c.border },
    vertical: { width: StyleSheet.hairlineWidth, backgroundColor: c.border },
  });

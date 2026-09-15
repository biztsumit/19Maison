import { View, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

interface DividerProps {
  vertical?: boolean;
  style?: ViewStyle;
}

export function Divider({ vertical = false, style }: DividerProps) {
  return <View style={[vertical ? styles.vertical : styles.horizontal, style]} />;
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing[4],
  },
  vertical: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing[2],
  },
});

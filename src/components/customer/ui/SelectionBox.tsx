import { StyleSheet, View } from 'react-native';
import { Icon } from './Icon';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  selected: boolean;
  size?: number;
}

// Radio-style affordance used by the checkout address cards.
export function SelectionBox({ selected, size = 24 }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  return (
    <View style={[styles.box, { width: size, height: size }, selected && styles.selected]}>
      {selected && <Icon name="check" size={size * 0.6} color={colors.onInverse} strokeWidth={3} />}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    box: {
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selected: { backgroundColor: c.inverseSurface, borderColor: c.inverseSurface },
  });

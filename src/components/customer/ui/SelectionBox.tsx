import { StyleSheet, View } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { Icon } from './Icon';

interface Props {
  selected: boolean;
  size?: number;
}

// Radio-style affordance used by the checkout address cards.
export function SelectionBox({ selected, size = 24 }: Props) {
  return (
    <View style={[styles.box, { width: size, height: size }, selected && styles.selected]}>
      {selected && (
        <Icon name="check" size={size * 0.6} color={CustomerColors.textInverse} strokeWidth={3} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: CustomerColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: CustomerColors.bgDark, borderColor: CustomerColors.bgDark },
});

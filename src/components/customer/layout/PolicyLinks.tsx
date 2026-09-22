import { Pressable, StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';

export interface PolicyLink {
  label: string;
  onPress: () => void;
}

interface Props {
  links: PolicyLink[];
}

export function PolicyLinks({ links }: Props) {
  return (
    <View style={styles.row}>
      {links.map(link => (
        <Pressable key={link.label} onPress={link.onPress} accessibilityRole="link" hitSlop={6}>
          <Text variant="link">{link.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[4],
    justifyContent: 'center',
  },
});

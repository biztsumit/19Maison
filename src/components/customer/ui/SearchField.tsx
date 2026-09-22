import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { CustomerColors, CustomerText } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import { Text } from './Text';

interface Props extends Omit<TextInputProps, 'style'> {
  onPress?: () => void;
  readOnly?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

// `readOnly` + `onPress` makes this a tap target that navigates to the search
// screen, which is how the header search behaves.
export function SearchField({
  onPress,
  readOnly = false,
  placeholder = 'Search',
  containerStyle,
  value,
  ...rest
}: Props) {
  if (readOnly) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.field, containerStyle]}
        accessibilityRole="search"
      >
        <Icon name="search" size={18} color={CustomerColors.textMuted} />
        <Text variant="bodyMuted" numberOfLines={1} style={styles.flex}>
          {value || placeholder}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.field, containerStyle]}>
      <Icon name="search" size={18} color={CustomerColors.textMuted} />
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={CustomerColors.textMuted}
        style={[CustomerText.body, styles.flex]}
        returnKeyType="search"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2.5],
    height: 44,
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: CustomerColors.inputBg,
  },
  flex: { flex: 1, paddingVertical: 0 },
});

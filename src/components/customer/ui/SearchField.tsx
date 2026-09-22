import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { CustomerText } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

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
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  if (readOnly) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.field, containerStyle]}
        accessibilityRole="search"
      >
        <Icon name="search" size={18} color={colors.textMuted} />
        <Text variant="bodyMuted" numberOfLines={1} style={styles.flex}>
          {value || placeholder}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.field, containerStyle]}>
      <Icon name="search" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[CustomerText.body, styles.flex]}
        returnKeyType="search"
        {...rest}
      />
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing[2.5],
      height: 44,
      paddingHorizontal: Spacing[4],
      borderRadius: BorderRadius.lg,
      backgroundColor: c.inputBg,
    },
    flex: { flex: 1, paddingVertical: 0 },
  });

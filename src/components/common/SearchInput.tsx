import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import type { TextInputProps, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { FontSize } from '@/theme/typography';
import { Text } from './Text';

interface SearchInputProps extends TextInputProps {
  onClear?: () => void;
  containerStyle?: ViewStyle;
}

export function SearchInput({ onClear, containerStyle, value, ...rest }: SearchInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.icon}>⊕</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.textMuted}
        selectionColor={Colors.gold}
        cursorColor={Colors.gold}
        autoCapitalize="none"
        returnKeyType="search"
        value={value}
        {...rest}
      />
      {value && value.length > 0 && onClear && (
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <Text style={styles.clearIcon} color="muted">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 48,
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
  },
  icon: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
  },
});

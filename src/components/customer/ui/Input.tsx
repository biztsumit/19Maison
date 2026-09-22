import { StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { CustomerColors, CustomerLayout, CustomerText } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Text } from './Text';

interface Props extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, required, error, containerStyle, style, ...rest }: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="inputLabel">
          {label}
          {required ? ' *' : ''}
        </Text>
      )}
      <TextInput
        placeholderTextColor={CustomerColors.textMuted}
        style={[
          styles.input,
          rest.multiline && styles.multiline,
          Boolean(error) && styles.errored,
          style,
        ]}
        {...rest}
      />
      {Boolean(error) && <Text variant="errorText">{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing[1.5] },
  input: {
    ...CustomerText.body,
    height: CustomerLayout.controlHeight,
    paddingHorizontal: Spacing[4],
    borderWidth: 1,
    borderColor: CustomerColors.border,
    borderRadius: CustomerLayout.cardRadius,
    backgroundColor: CustomerColors.bg,
  },
  multiline: { height: 96, paddingTop: Spacing[3], textAlignVertical: 'top' },
  errored: { borderColor: CustomerColors.error },
});

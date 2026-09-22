import { StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { CustomerLayout, textFor } from '@/theme/customer';

import { Spacing } from '@/theme/spacing';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, required, error, containerStyle, style, ...rest }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="inputLabel">
          {label}
          {required ? ' *' : ''}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
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

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    container: { gap: Spacing[1.5] },
    input: {
      ...textFor(c).body,
      height: CustomerLayout.controlHeight,
      paddingHorizontal: Spacing[4],
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: CustomerLayout.cardRadius,
      backgroundColor: c.bg,
    },
    multiline: { height: 96, paddingTop: Spacing[3], textAlignVertical: 'top' },
    errored: { borderColor: c.error },
  });

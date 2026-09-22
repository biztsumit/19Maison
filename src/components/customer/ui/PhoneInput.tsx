import { StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { CustomerLayout, textFor } from '@/theme/customer';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';
import { Spacing } from '@/theme/spacing';
import { INDIA_DIAL_CODE, INDIA_PHONE_LENGTH, toNationalPhone } from '@/utils/phone';
import { Text } from './Text';

interface Props extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  label?: string;
  required?: boolean;
  error?: string;
  /** The 10-digit national number, without the country code. */
  value: string;
  onChangeText: (national: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// The dial code is a fixed, non-editable affordance rather than part of the value:
// the app only serves India, and leaving it editable is what produced the
// `9876543210` / `919876543210` / `+919876543210` mix already in the backend.
// Callers hold the national number and convert with `toE164Phone` on submit.
export function PhoneInput({
  label,
  required,
  error,
  value,
  onChangeText,
  containerStyle,
  style,
  ...rest
}: Props) {
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

      <View style={[styles.field, Boolean(error) && styles.errored]}>
        <View style={styles.prefix}>
          <Text variant="body" accessibilityElementsHidden importantForAccessibility="no">
            {INDIA_DIAL_CODE}
          </Text>
        </View>
        <TextInput
          style={[styles.input, style]}
          value={value}
          // Sanitised here rather than in the schema so pasting `+91 98765 43210`
          // lands as ten digits instead of being rejected on submit.
          onChangeText={next => onChangeText(toNationalPhone(next))}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          maxLength={INDIA_PHONE_LENGTH}
          placeholder="98765 43210"
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={label ? `${label}, country code ${INDIA_DIAL_CODE}` : undefined}
          {...rest}
        />
      </View>

      {Boolean(error) && <Text variant="errorText">{error}</Text>}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    container: { gap: Spacing[1.5] },
    field: {
      flexDirection: 'row',
      alignItems: 'stretch',
      height: CustomerLayout.controlHeight,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: CustomerLayout.cardRadius,
      backgroundColor: c.bg,
    },
    prefix: {
      justifyContent: 'center',
      paddingHorizontal: Spacing[4],
      borderRightWidth: 1,
      borderRightColor: c.border,
      backgroundColor: c.bgAlt,
    },
    input: {
      ...textFor(c).body,
      flex: 1,
      paddingHorizontal: Spacing[4],
    },
    errored: { borderColor: c.error },
  });

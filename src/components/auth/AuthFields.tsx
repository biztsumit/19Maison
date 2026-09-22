import { useState } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Text } from '@/components/common/Text';
import { Colors } from '@/theme/colors';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';
import { Font, FontSize } from '@/theme/typography';
import { INDIA_DIAL_CODE, INDIA_PHONE_LENGTH, toNationalPhone } from '@/utils/phone';

// The auth screens share one field design — a 56pt dark box with an optional error
// line underneath. Before this, each screen rebuilt it, and only Sign up actually
// rendered its validation messages.

interface FieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

type TextFieldProps<T extends FieldValues> = FieldProps<T> &
  Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'>;

function FieldError({ message }: { message?: string }) {
  const styles = useThemedStyles(makeStyles);
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
}

export function AuthTextField<T extends FieldValues>({
  control,
  name,
  ...rest
}: TextFieldProps<T>) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.group}>
          <View style={[styles.box, Boolean(error) && styles.boxError]}>
            <TextInput
              style={styles.input}
              placeholderTextColor={colors.authTextMuted}
              value={(value as string | undefined) ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              {...rest}
            />
          </View>
          <FieldError message={error?.message} />
        </View>
      )}
    />
  );
}

/** Holds the 10-digit national number; the `+91` is fixed chrome, not part of the value. */
export function AuthPhoneField<T extends FieldValues>({
  control,
  name,
  placeholder = '98765 43210',
  ...rest
}: TextFieldProps<T>) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.group}>
          <View style={[styles.box, styles.row, Boolean(error) && styles.boxError]}>
            <Text style={styles.dialCode}>{INDIA_DIAL_CODE}</Text>
            <View style={styles.dialDivider} />
            <TextInput
              style={[styles.input, styles.grow]}
              placeholder={placeholder}
              placeholderTextColor={colors.authTextMuted}
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
              maxLength={INDIA_PHONE_LENGTH}
              autoCapitalize="none"
              value={(value as string | undefined) ?? ''}
              // Sanitised on the way in, so a pasted `+91 98765 43210` still lands
              // as ten digits rather than failing validation.
              onChangeText={next => onChange(toNationalPhone(next))}
              onBlur={onBlur}
              accessibilityLabel={`Phone number, country code ${INDIA_DIAL_CODE}`}
              {...rest}
            />
          </View>
          <FieldError message={error?.message} />
        </View>
      )}
    />
  );
}

export function AuthPasswordField<T extends FieldValues>({
  control,
  name,
  placeholder = 'Enter your password',
  ...rest
}: TextFieldProps<T>) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.group}>
          <View style={[styles.box, styles.row, Boolean(error) && styles.boxError]}>
            <TextInput
              style={[styles.input, styles.grow]}
              placeholder={placeholder}
              placeholderTextColor={colors.authTextMuted}
              secureTextEntry={!visible}
              autoCapitalize="none"
              value={(value as string | undefined) ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              {...rest}
            />
            <TouchableOpacity
              onPress={() => setVisible(v => !v)}
              hitSlop={8}
              style={styles.eyeBtn}
              accessibilityRole="button"
              accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            >
              <Text style={styles.eyeIcon}>{visible ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>
          <FieldError message={error?.message} />
        </View>
      )}
    />
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    group: { gap: 6 },
    box: {
      height: 56,
      backgroundColor: c.authSurface,
      borderWidth: 1,
      borderColor: c.authBorder,
      borderRadius: 8,
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    boxError: { borderColor: Colors.error },
    row: { flexDirection: 'row', alignItems: 'center' },
    grow: { flex: 1 },
    input: {
      fontFamily: Font.regular,
      fontSize: FontSize.md,
      color: c.authText,
      paddingVertical: 0,
    },
    dialCode: {
      fontFamily: Font.regular,
      fontSize: FontSize.md,
      color: c.authText,
    },
    dialDivider: {
      width: 1,
      height: 24,
      marginHorizontal: 12,
      backgroundColor: c.authBorder,
    },
    eyeBtn: { paddingLeft: 8 },
    eyeIcon: { fontSize: 16 },
    error: {
      fontFamily: Font.regular,
      fontSize: FontSize.sm,
      color: Colors.error,
    },
  });

import { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { TextInputProps, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { FontSize, FontWeight } from '@/theme/typography';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  containerStyle,
  isPassword = false,
  secureTextEntry,
  style,
  ...rest
}: InputProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="label" color="muted" style={styles.label}>
          {label}
        </Text>
      )}

      <View style={[styles.inputWrapper, error ? styles.inputError : styles.inputNormal]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          selectionColor={Colors.gold}
          cursorColor={Colors.gold}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          autoCapitalize="none"
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setPasswordVisible(v => !v)}
            style={styles.rightElement}
          >
            <Text variant="bodySmall" color="muted">
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        ) : rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : null}
      </View>

      {error && (
        <Text variant="caption" color="error" style={styles.errorText}>
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text variant="caption" color="muted" style={styles.hint}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing[1.5],
  },
  label: {
    marginBottom: Spacing[1],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: Colors.surfaceElevated,
    height: 52,
    paddingHorizontal: Spacing[4],
  },
  inputNormal: {
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: Spacing[3],
  },
  rightElement: {
    marginLeft: Spacing[3],
  },
  errorText: {
    marginTop: Spacing[0.5],
  },
  hint: {
    marginTop: Spacing[0.5],
  },
});

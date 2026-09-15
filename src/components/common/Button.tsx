import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import type { TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { FontSize, FontWeight, LetterSpacing } from '@/theme/typography';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  labelStyle,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.gold : Colors.textInverse}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[styles.label, styles[`label_${variant}`], styles[`label_${size}`], labelStyle]}>
            {label}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.none,
    borderWidth: 1,
    borderColor: Colors.transparent,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: { marginRight: Spacing[2] },
  iconRight: { marginLeft: Spacing[2] },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.45 },

  // Variants
  primary: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  secondary: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.gold,
  },
  ghost: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.transparent,
  },
  gold: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },

  // Sizes
  sm: {
    height: 36,
    paddingHorizontal: Spacing[4],
    minWidth: 80,
  },
  md: {
    height: 48,
    paddingHorizontal: Spacing[6],
    minWidth: 120,
  },
  lg: {
    height: 56,
    paddingHorizontal: Spacing[8],
    minWidth: 160,
  },

  // Label base
  label: {
    letterSpacing: LetterSpacing.widest,
    textTransform: 'uppercase',
  },

  // Label variants
  label_primary: { color: Colors.textInverse, fontWeight: FontWeight.semibold },
  label_secondary: { color: Colors.textPrimary, fontWeight: FontWeight.medium },
  label_outline: { color: Colors.gold, fontWeight: FontWeight.medium },
  label_ghost: { color: Colors.textPrimary, fontWeight: FontWeight.medium },
  label_gold: { color: Colors.textInverse, fontWeight: FontWeight.semibold },

  // Label sizes
  label_sm: { fontSize: FontSize.xs },
  label_md: { fontSize: FontSize.sm },
  label_lg: { fontSize: FontSize.base },
});

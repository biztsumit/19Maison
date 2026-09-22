import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { CustomerColors, CustomerLayout, CustomerText } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { FontSize } from '@/theme/typography';
import { Text } from './Text';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export type ButtonVariant = 'solid' | 'outline' | 'light' | 'gold' | 'link' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  uppercase?: boolean;
  style?: StyleProp<ViewStyle>;
}

const LABEL_COLOR: Record<ButtonVariant, string> = {
  solid: CustomerColors.textInverse,
  outline: CustomerColors.text,
  light: CustomerColors.text,
  gold: CustomerColors.text,
  link: CustomerColors.accent,
  danger: CustomerColors.textInverse,
};

export function Button({
  label,
  onPress,
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  uppercase = true,
  style,
}: Props) {
  const isDisabled = disabled || loading;
  const labelColor = LABEL_COLOR[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <Icon name={leftIcon} size={FontSize.md} color={labelColor} />}
          <Text
            style={[
              CustomerText.ctaLabel,
              { color: labelColor },
              !uppercase && styles.noTransform,
              size === 'sm' && styles.labelSm,
            ]}
          >
            {label}
          </Text>
          {rightIcon && <Icon name={rightIcon} size={FontSize.md} color={labelColor} />}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CustomerLayout.cardRadius,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  fullWidth: { alignSelf: 'stretch', width: '100%' },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.4 },
  noTransform: { textTransform: 'none' },
  labelSm: { fontSize: FontSize.sm },
});

const sizeStyles = StyleSheet.create({
  sm: { height: 38, paddingHorizontal: Spacing[4] },
  md: { height: CustomerLayout.controlHeight, paddingHorizontal: Spacing[5] },
  lg: { height: CustomerLayout.ctaHeight, paddingHorizontal: Spacing[6] },
});

const variantStyles = StyleSheet.create({
  solid: { backgroundColor: CustomerColors.bgDark },
  outline: {
    backgroundColor: CustomerColors.transparent,
    borderWidth: 1,
    borderColor: CustomerColors.borderStrong,
  },
  light: { backgroundColor: CustomerColors.bg },
  gold: { backgroundColor: CustomerColors.accent },
  // Deletions and cancellations. The only place the palette's red is used as a
  // fill rather than as text.
  danger: { backgroundColor: CustomerColors.error },
  link: {
    backgroundColor: CustomerColors.transparent,
    height: 'auto',
    paddingHorizontal: 0,
  },
});

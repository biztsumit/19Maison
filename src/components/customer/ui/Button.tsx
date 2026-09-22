import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { CustomerLayout, CustomerText } from '@/theme/customer';
import type { CustomerPalette } from '@/theme/palette';
import { useTheme, useThemedStyles } from '@/theme/theme-provider';
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

const labelColors = (c: CustomerPalette): Record<ButtonVariant, string> => ({
  solid: c.onInverse,
  outline: c.text,
  light: c.text,
  // The gold fill is the same colour in both schemes, so its label cannot follow
  // the page's text colour or it would turn white-on-gold in dark mode.
  gold: c.onAccent,
  link: c.accent,
  danger: c.textInverse,
});

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
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const variantStyles = useThemedStyles(makeVariantStyles);
  const isDisabled = disabled || loading;
  const labelColor = labelColors(colors)[variant];

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

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    base: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: CustomerLayout.cardRadius,
      backgroundColor: c.transparent,
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

const makeVariantStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    // The primary fill inverts with the scheme — black on a light page, near-white
    // on a dark one — so the main CTA is always the highest-contrast element.
    solid: { backgroundColor: c.inverseSurface },
    outline: {
      backgroundColor: c.transparent,
      borderWidth: 1,
      borderColor: c.borderStrong,
    },
    light: { backgroundColor: c.bg },
    gold: { backgroundColor: c.accent },
    // Deletions and cancellations. The only place the palette's red is used as a
    // fill rather than as text.
    danger: { backgroundColor: c.error },
    link: {
      backgroundColor: c.transparent,
      height: 'auto',
      paddingHorizontal: 0,
    },
  });

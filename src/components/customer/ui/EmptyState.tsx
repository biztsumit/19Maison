import { StyleSheet, View } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Button } from './Button';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'screen' | 'inline';
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  variant = 'screen',
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  return (
    <View style={[styles.wrap, variant === 'screen' && styles.screen]}>
      {icon && (
        <View style={styles.iconRing}>
          <Icon name={icon} size={26} color={colors.textMuted} />
        </View>
      )}
      <Text variant="sectionHeading" style={styles.center}>
        {title}
      </Text>
      {message && (
        <Text variant="bodyMuted" style={styles.center}>
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} variant="solid" style={styles.action} />
      )}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    wrap: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing[3],
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[10],
    },
    screen: { flex: 1 },
    center: { textAlign: 'center' },
    iconRing: {
      width: 64,
      height: 64,
      borderRadius: BorderRadius.full,
      backgroundColor: c.bgAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    action: { marginTop: Spacing[2], minWidth: 200 },
  });

import { StyleSheet, View } from 'react-native';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Button } from './Button';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Text } from './Text';

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
  return (
    <View style={[styles.wrap, variant === 'screen' && styles.screen]}>
      {icon && (
        <View style={styles.iconRing}>
          <Icon name={icon} size={26} color={CustomerColors.textMuted} />
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

const styles = StyleSheet.create({
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
    backgroundColor: CustomerColors.bgAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: { marginTop: Spacing[2], minWidth: 200 },
});

import { View, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from './Text';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({ title, subtitle, actionLabel, onAction, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>◯</Text>
      </View>
      <Text variant="headingSmall" color="primary" style={styles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" color="muted" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="outline"
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
    gap: Spacing[4],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  icon: {
    fontSize: 32,
    color: Colors.textMuted,
  },
  title: {
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: Spacing[2],
  },
});

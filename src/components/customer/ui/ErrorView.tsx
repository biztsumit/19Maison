import { StyleSheet, View } from 'react-native';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function ErrorView({ title = 'Something went wrong', message, onRetry, onBack }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconRing}>
        <Icon name="alert" size={26} color={CustomerColors.error} />
      </View>
      <Text variant="sectionHeading" style={styles.center}>
        {title}
      </Text>
      {message && (
        <Text variant="bodyMuted" style={styles.center}>
          {message}
        </Text>
      )}
      <View style={styles.actions}>
        {onRetry && <Button label="Try again" onPress={onRetry} variant="solid" />}
        {onBack && <Button label="Go back" onPress={onBack} variant="outline" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    paddingHorizontal: CustomerLayout.screenPaddingH,
  },
  center: { textAlign: 'center' },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: CustomerColors.bgAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: Spacing[3], marginTop: Spacing[2] },
});

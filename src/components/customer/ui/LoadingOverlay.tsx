import { Modal, StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Spinner } from './Spinner';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  visible: boolean;
  message?: string;
}

// Blocks the screen while something irreversible is in flight — placing an order,
// uploading an image. Deliberately declarative rather than an imperative global
// `showLoader()`: a singleton that any caller can turn on is a singleton someone
// eventually forgets to turn off, and the user is then stuck behind it.
//
// It is a Modal so it covers navigation chrome too, and it swallows the Android
// back button (onRequestClose is a no-op) so the action cannot be abandoned midway.
export function LoadingOverlay({ visible, message }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.root}>
        <View style={styles.card}>
          <Spinner size="lg" />
          {Boolean(message) && (
            <Text variant="bodySmall" style={styles.message}>
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.overlayMedium,
    },
    card: {
      alignItems: 'center',
      gap: Spacing[4],
      paddingVertical: Spacing[8],
      paddingHorizontal: Spacing[10],
      backgroundColor: c.bg,
    },
    message: { textAlign: 'center' },
  });

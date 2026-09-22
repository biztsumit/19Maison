import { View, StyleSheet } from 'react-native';
import { Spinner } from '@/components/customer/ui/Spinner';
import { CustomerColors } from '@/theme/customer';

// Root index — the auth gate in _layout.tsx handles all redirects.
// This screen is shown only during the brief session-restore check.
export default function Index() {
  return (
    <View style={styles.container}>
      <Spinner size="lg" trackColor={CustomerColors.overlayLight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Matches the native splash exactly, so the handover has no seam.
    backgroundColor: CustomerColors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

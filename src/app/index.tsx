import { View, StyleSheet } from 'react-native';
import { Spinner } from '@/components/customer/ui/Spinner';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

// Root index — the auth gate in _layout.tsx handles all redirects.
// This screen is shown only during the brief session-restore check.
export default function Index() {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Spinner size="lg" trackColor={colors.overlayLight} />
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // Matches the native splash exactly, so the handover has no seam.
      backgroundColor: c.bgDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';

// Root index — the auth gate in _layout.tsx handles all redirects.
// This screen is shown only during the brief session-restore check.
export default function Index() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.gold} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

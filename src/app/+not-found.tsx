import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text variant="displayLarge" color="gold" style={styles.code}>
            404
          </Text>
          <View style={styles.goldLine} />
          <Text variant="headingSmall" color="primary" style={styles.title}>
            Page Not Found
          </Text>
          <Text variant="body" color="muted" style={styles.desc}>
            The page you are looking for does not exist or has been moved.
          </Text>
          <Button
            label="Go Home"
            variant="outline"
            onPress={() => router.replace('/')}
            style={styles.btn}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
    gap: Spacing[4],
  },
  code: { letterSpacing: 8, fontWeight: '100' },
  goldLine: { width: 48, height: 1, backgroundColor: Colors.gold },
  title: { textAlign: 'center', letterSpacing: 2 },
  desc: { textAlign: 'center', lineHeight: 24 },
  btn: { marginTop: Spacing[4] },
});

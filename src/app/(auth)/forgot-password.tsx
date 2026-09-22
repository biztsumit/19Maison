import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.logoWrap}>
          <Text style={styles.logoText}>19 MAISON</Text>
          <LinearGradient
            colors={['#BF953F', '#FCF6BA', '#B38728', '#FBF5B7', '#AA771C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoUnderline}
          />
        </View>
        <View style={styles.iconBtn} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <View style={styles.content}>
          {sent ? (
            <View style={styles.card}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.cardTitle}>Email Sent</Text>
              <Text style={styles.cardDesc}>
                Check your inbox for a password reset link. It may take a few minutes to arrive.
              </Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.back()}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>BACK TO LOGIN</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Forgot Password</Text>
              <Text style={styles.cardDesc}>
                Enter your phone number or email and we&apos;ll send you a reset link.
              </Text>

              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={Colors.textGray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, !email && { opacity: 0.4 }]}
                onPress={() => setSent(true)}
                disabled={!email}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>SEND RESET LINK</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                <Text style={styles.backLinkText}>← Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerIcon: { fontSize: 22, color: Colors.textDark, fontFamily: Font.regular },
  logoWrap: { alignItems: 'center', gap: 4 },
  logoText: { fontFamily: Font.semibold, fontSize: 14, letterSpacing: 6, color: Colors.textDark },
  logoUnderline: { height: 2, width: 60, borderRadius: 1 },
  kav: { flex: 1 },
  content: { flex: 1, padding: 16, paddingTop: 40 },
  card: { borderWidth: 1, borderColor: Colors.lightBorder, padding: 16, gap: 24 },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkIcon: { fontSize: 28, color: Colors.gold },
  cardTitle: {
    fontFamily: Font.medium,
    fontSize: FontSize['2xl'],
    color: Colors.textDark,
    lineHeight: FontSize['2xl'],
  },
  cardDesc: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: Colors.textGray,
    lineHeight: FontSize.md * 1.6,
  },
  inputBox: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: Colors.textDark,
    paddingVertical: 0,
  },
  primaryBtn: {
    backgroundColor: Colors.textDark,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  primaryBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: Colors.white,
    letterSpacing: 2,
  },
  backLink: { alignItems: 'center' },
  backLinkText: { fontFamily: Font.medium, fontSize: FontSize.md, color: Colors.textGray },
});

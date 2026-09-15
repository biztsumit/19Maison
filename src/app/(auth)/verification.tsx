import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';
import { useAuth } from '@/hooks/useAuth';
import { verifyOtpThunk } from '@/store/slices/auth.slice';

const appLogo = require('../../../assets/images/appLogo.png');

const INPUT_BG = '#131313';
const INPUT_BORDER = 'rgba(98, 98, 98, 0.87)';
const PLACEHOLDER = '#626262';
const TEXT_WHITE = '#F9F9F9';

export default function VerificationScreen() {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const { verifyOtp, isLoading, pendingPhone } = useAuth();

  const handleVerify = async () => {
    if (code.length < 6 || !pendingPhone) return;
    const result = await verifyOtp({ phone: pendingPhone, otp: code });
    if (verifyOtpThunk.rejected.match(result)) {
      Toast.show({ type: 'error', text1: 'Verification failed', text2: result.error.message });
    }
    // On success AuthGate auto-redirects to /(customer)
  };

  const handleResend = () => {
    // TODO: call resend OTP endpoint
    Toast.show({ type: 'info', text1: 'OTP resent' });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <Image source={appLogo} style={styles.logo} contentFit="contain" />
          </View>

          {/* Content */}
          <View style={styles.formContainer}>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>Enter verification code</Text>
              <Text style={styles.subtitle}>
                Enter 6-digit code sent to {pendingPhone ?? 'your phone'}
              </Text>
            </View>

            {/* Code input */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.codeInput}
                placeholder="------"
                placeholderTextColor={PLACEHOLDER}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                value={code}
                onChangeText={setCode}
              />
            </View>

            {/* Verify CTA */}
            <TouchableOpacity
              style={[styles.primaryBtn, (code.length < 6 || isLoading) && styles.btnDisabled]}
              onPress={handleVerify}
              disabled={code.length < 6 || isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>VERIFY</Text>
            </TouchableOpacity>

            {/* Resend link */}
            <TouchableOpacity onPress={handleResend} style={styles.resendWrap}>
              <Text style={styles.resendText}>Resend code</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textDark,
  },
  kav: { flex: 1 },
  scroll: { flexGrow: 1 },

  header: {
    backgroundColor: Colors.textDark,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logo: { width: 210, height: 44 },

  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 40,
  },

  titleBlock: { gap: 12 },
  title: {
    fontFamily: Font.medium,
    fontSize: FontSize['2xl'],
    color: TEXT_WHITE,
  },
  subtitle: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.3,
    color: PLACEHOLDER,
  },

  inputBox: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  codeInput: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: TEXT_WHITE,
    letterSpacing: 8,
    paddingVertical: 0,
  },

  primaryBtn: {
    backgroundColor: Colors.gold,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  primaryBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: TEXT_WHITE,
    textTransform: 'uppercase',
  },

  resendWrap: { alignItems: 'center' },
  resendText: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: Colors.gold,
    textDecorationLine: 'underline',
  },
});

import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthTextField } from '@/components/auth/AuthFields';
import { Colors } from '@/theme/colors';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';
import { useAuth } from '@/hooks/useAuth';
import { verifyOtpThunk } from '@/store/slices/auth.slice';
import { formatPhone } from '@/utils/phone';
import { otpSchema } from '@/utils/validators';
import type { OtpSchema } from '@/utils/validators';

const appLogo = require('../../../assets/images/appLogo.png');

export default function VerificationScreen() {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const { verifyOtp, isLoading, pendingPhone } = useAuth();

  const { control, handleSubmit } = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { otp: '' },
  });

  const onSubmit = async ({ otp }: OtpSchema) => {
    if (!pendingPhone) {
      Toast.show({ type: 'error', text1: 'Start again', text2: 'We lost track of your number.' });
      return;
    }
    const result = await verifyOtp({ phone: pendingPhone, otp });
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
                Enter 6-digit code sent to {formatPhone(pendingPhone) || 'your phone'}
              </Text>
            </View>

            {/* Code input */}
            <AuthTextField
              control={control}
              name="otp"
              placeholder="------"
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              style={styles.codeInput}
            />

            {/* Verify CTA */}
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
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

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.authBg,
    },
    kav: { flex: 1 },
    scroll: { flexGrow: 1 },

    header: {
      backgroundColor: c.authBg,
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
      color: c.authText,
    },
    subtitle: {
      fontFamily: Font.medium,
      fontSize: FontSize.md,
      lineHeight: FontSize.md * 1.3,
      color: c.authTextMuted,
    },

    codeInput: { letterSpacing: 8 },

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
      color: c.authText,
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

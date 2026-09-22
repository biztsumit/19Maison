import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthPasswordField, AuthPhoneField } from '@/components/auth/AuthFields';
import { Colors } from '@/theme/colors';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';
import { Font, FontSize } from '@/theme/typography';
import { useAuth } from '@/hooks/useAuth';
import { toE164Phone } from '@/utils/phone';
import { loginSchema } from '@/utils/validators';
import type { LoginSchema } from '@/utils/validators';
import { loginThunk } from '@/store/slices/auth.slice';
import { Text } from '@/components/common/Text';
import { takeAuthNotice } from '@/utils/auth-notice';

const googleLogo = require('../../../assets/images/google-logo.png');

export default function LoginScreen() {
  const styles = useThemedStyles(makeStyles);
  const { login, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  // Set by the auth gate when it refuses a session, e.g. a staff account.
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => setNotice(takeAuthNotice()), []);

  const { control, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = async (data: LoginSchema) => {
    // The form holds the national number; the API expects E.164.
    const result = await login({ phone: toE164Phone(data.phone), password: data.password });
    if (loginThunk.rejected.match(result)) {
      Toast.show({ type: 'error', text1: 'Login failed', text2: result.error.message });
    }
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
          {/* Header / Logo */}
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <View style={styles.logoWrap}>
              <Image
                source={require('../../../assets/images/appLogo.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>

            {Boolean(notice) && (
              <View style={styles.notice}>
                <Text style={styles.noticeText}>{notice}</Text>
              </View>
            )}

            <View style={styles.fields}>
              <AuthPhoneField control={control} name="phone" />

              <View style={styles.passwordGroup}>
                <AuthPasswordField control={control} name="password" />

                <TouchableOpacity
                  onPress={() => router.push('/(auth)/forgot-password')}
                  style={styles.forgotWrap}
                >
                  <Text style={styles.forgotText}>Forgot Password!</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login CTA */}
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Or divider */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Or</Text>
              <View style={styles.orLine} />
            </View>

            {/* Google button */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
              <Image source={googleLogo} style={styles.googleLogo} contentFit="contain" />
              <Text style={styles.googleText}>Google</Text>
            </TouchableOpacity>

            {/* Sign up link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomBase}>Don&apos;t have account, </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.bottomLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    notice: {
      marginBottom: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: Colors.gold,
      backgroundColor: 'rgba(212, 175, 55, 0.12)',
    },
    noticeText: {
      fontFamily: Font.regular,
      fontSize: FontSize.base,
      lineHeight: FontSize.base * 1.5,
      color: c.authText,
    },
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
    logoWrap: { alignItems: 'center', paddingBottom: 8 },
    logo: { width: 210, height: 44 },

    formContainer: {
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 40,
      gap: 40,
    },
    title: {
      fontFamily: Font.medium,
      fontSize: FontSize['2xl'],
      color: c.authText,
    },

    fields: { gap: 24 },

    passwordGroup: { gap: 16 },
    forgotWrap: { alignSelf: 'flex-end' },
    forgotText: {
      fontFamily: Font.regular,
      fontSize: FontSize.md,
      color: c.authTextMuted,
      textDecorationLine: 'underline',
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
      color: c.authText,
      textTransform: 'uppercase',
    },

    orRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    orLine: { flex: 1, height: 1, backgroundColor: c.authBorder },
    orText: {
      fontFamily: Font.medium,
      fontSize: FontSize.lg,
      color: c.authTextMuted,
    },

    googleBtn: {
      height: 56,
      backgroundColor: c.authSurface,
      borderWidth: 1,
      borderColor: c.authBorder,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    googleLogo: { width: 20, height: 20 },
    googleText: {
      fontFamily: Font.semibold,
      fontSize: FontSize.md,
      color: c.authText,
    },

    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    bottomBase: {
      fontFamily: Font.medium,
      fontSize: FontSize.lg,
      color: c.authText,
    },
    bottomLink: {
      fontFamily: Font.medium,
      fontSize: FontSize.lg,
      color: Colors.gold,
      textDecorationLine: 'underline',
    },
  });

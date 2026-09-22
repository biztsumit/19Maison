import { Text } from '@/components/common/Text';
import { AuthPasswordField, AuthPhoneField, AuthTextField } from '@/components/auth/AuthFields';
import { useAuth } from '@/hooks/useAuth';
import { registerThunk } from '@/store/slices/auth.slice';
import { Colors } from '@/theme/colors';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';
import { Font, FontSize } from '@/theme/typography';
import { toE164Phone } from '@/utils/phone';
import type { RegisterSchema } from '@/utils/validators';
import { registerSchema } from '@/utils/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const styles = useThemedStyles(makeStyles);
  const { register, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    // Sign up asks for five fields; correcting each one as it is left beats
    // surfacing five errors at once when the CTA is finally pressed.
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { firstName: '', lastName: '', phone: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterSchema) => {
    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      // The form holds the national number; the API expects E.164.
      phone: toE164Phone(data.phone),
      password: data.password,
      ...(data.email ? { email: data.email.trim() } : {}),
    };
    const result = await register(payload);

    if (registerThunk.rejected.match(result)) {
      Toast.show({ type: 'error', text1: 'Sign up failed', text2: result.error.message });
      return;
    }
    // OTP sent — navigate to verification
    router.push('/(auth)/verification');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoRow}>
            <Image
              source={require('../../../assets/images/appLogo.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Sign up</Text>

            <View style={styles.fields}>
              <AuthTextField
                control={control}
                name="firstName"
                placeholder="First name"
                autoCapitalize="words"
                autoComplete="given-name"
                textContentType="givenName"
              />

              <AuthTextField
                control={control}
                name="lastName"
                placeholder="Last name"
                autoCapitalize="words"
                autoComplete="family-name"
                textContentType="familyName"
              />

              <AuthPhoneField control={control} name="phone" />

              <AuthTextField
                control={control}
                name="email"
                placeholder="Email (optional)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />

              <AuthPasswordField
                control={control}
                name="password"
                placeholder="Password"
                textContentType="newPassword"
              />
            </View>

            {/* Gold Sign Up CTA */}
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Sign up</Text>
            </TouchableOpacity>

            {/* Or divider */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Or</Text>
              <View style={styles.orLine} />
            </View>

            {/* Google (dark) */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
              <Image
                source={require('../../../assets/images/google-logo.png')}
                style={styles.googleLogo}
                contentFit="contain"
              />
              <Text style={styles.googleText}>Google</Text>
            </TouchableOpacity>

            {/* Login link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomBase}>Already have account, </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.bottomLink}>Log in</Text>
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
    container: { flex: 1, backgroundColor: c.authBg },
    kav: { flex: 1 },
    scroll: { flexGrow: 1, paddingBottom: 40 },

    logoRow: { alignItems: 'center', paddingBottom: 8 },
    logo: { width: 210, height: 44 },

    form: { paddingHorizontal: 24, paddingTop: 40, gap: 32 },

    title: {
      fontFamily: Font.medium,
      fontSize: FontSize['2xl'],
      lineHeight: FontSize['2xl'],
      color: c.authText,
    },

    fields: { gap: 20 },

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
      letterSpacing: 1,
    },

    orRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    orLine: { flex: 1, height: 1, backgroundColor: c.authBorder },
    orText: { fontFamily: Font.medium, fontSize: FontSize.lg, color: c.authTextMuted },

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
    googleText: { fontFamily: Font.semibold, fontSize: FontSize.md, color: c.authText },

    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    bottomBase: { fontFamily: Font.medium, fontSize: FontSize.lg, color: c.authText },
    bottomLink: {
      fontFamily: Font.medium,
      fontSize: FontSize.lg,
      color: Colors.gold,
      textDecorationLine: 'underline',
    },
  });

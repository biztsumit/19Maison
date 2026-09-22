import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/utils/validators';
import type { LoginSchema } from '@/utils/validators';
import { loginThunk } from '@/store/slices/auth.slice';
import { Text } from '@/components/common/Text';
import { takeAuthNotice } from '@/utils/auth-notice';

const googleLogo = require('../../../assets/images/google-logo.png');

const INPUT_BG = '#131313';
const INPUT_BORDER = 'rgba(98, 98, 98, 0.87)';
const PLACEHOLDER = '#626262';
const TEXT_WHITE = '#F9F9F9';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);

  // Set by the auth gate when it refuses a session, e.g. a staff account.
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => setNotice(takeAuthNotice()), []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = async (data: LoginSchema) => {
    const result = await login(data);
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
            <View style={{ alignItems: 'center', paddingBottom: 8 }}>
              <Image
                source={require('../../../assets/images/appLogo.png')}
                style={{ width: 210, height: 44 }}
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

            {/* Fields */}
            <View style={styles.fields}>
              {/* Phone */}
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputBox, errors.phone && styles.inputError]}>
                    <TextInput
                      style={styles.input}
                      placeholder="+919876543210"
                      placeholderTextColor={PLACEHOLDER}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  </View>
                )}
              />

              {/* Password group */}
              <View style={styles.passwordGroup}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.inputBox,
                        styles.inputRow,
                        errors.password && styles.inputError,
                      ]}
                    >
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Enter your password"
                        placeholderTextColor={PLACEHOLDER}
                        secureTextEntry={!showPassword}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(v => !v)}
                        hitSlop={8}
                        style={styles.eyeBtn}
                      >
                        <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />

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

const styles = StyleSheet.create({
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
    color: TEXT_WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  kav: { flex: 1 },
  scroll: { flexGrow: 1 },

  header: {
    backgroundColor: '#000000',
    paddingBottom: 24,
    alignItems: 'center',
  },

  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 40,
  },
  title: {
    fontFamily: Font.medium,
    fontSize: FontSize['2xl'],
    color: TEXT_WHITE,
  },

  fields: { gap: 24 },

  inputBox: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputError: { borderColor: Colors.error },
  input: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: TEXT_WHITE,
    paddingVertical: 0,
  },
  eyeBtn: { paddingLeft: 8 },
  eyeIcon: { fontSize: 16 },

  passwordGroup: { gap: 16 },
  forgotWrap: { alignSelf: 'flex-end' },
  forgotText: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: PLACEHOLDER,
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
    color: TEXT_WHITE,
    textTransform: 'uppercase',
  },

  orRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orLine: { flex: 1, height: 1, backgroundColor: INPUT_BORDER },
  orText: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: PLACEHOLDER,
  },

  googleBtn: {
    height: 56,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
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
    color: TEXT_WHITE,
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
    color: TEXT_WHITE,
  },
  bottomLink: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: Colors.gold,
    textDecorationLine: 'underline',
  },
});

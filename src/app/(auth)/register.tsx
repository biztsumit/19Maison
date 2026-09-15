import { Text } from '@/components/common/Text';
import { useAuth } from '@/hooks/useAuth';
import { registerThunk } from '@/store/slices/auth.slice';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import type { RegisterSchema } from '@/utils/validators';
import { registerSchema } from '@/utils/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', phone: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterSchema) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      password: data.password,
      ...(data.email ? { email: data.email } : {}),
    };
    const result = await register(payload);
    console.log('results>>>>>', result);

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
              {/* First Name */}
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={[styles.inputBox, !!errors.firstName && styles.inputError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="First name"
                        placeholderTextColor={PLACEHOLDER}
                        autoCapitalize="words"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    </View>
                    {errors.firstName && (
                      <Text style={styles.fieldError}>{errors.firstName.message}</Text>
                    )}
                  </View>
                )}
              />

              {/* Last Name */}
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={[styles.inputBox, !!errors.lastName && styles.inputError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Last name"
                        placeholderTextColor={PLACEHOLDER}
                        autoCapitalize="words"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    </View>
                    {errors.lastName && (
                      <Text style={styles.fieldError}>{errors.lastName.message}</Text>
                    )}
                  </View>
                )}
              />

              {/* Phone */}
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={[styles.inputBox, !!errors.phone && styles.inputError]}>
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
                    {errors.phone && <Text style={styles.fieldError}>{errors.phone.message}</Text>}
                  </View>
                )}
              />

              {/* Email (optional) */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={[styles.inputBox, !!errors.email && styles.inputError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Email (optional)"
                        placeholderTextColor={PLACEHOLDER}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    </View>
                    {errors.email && <Text style={styles.fieldError}>{errors.email.message}</Text>}
                  </View>
                )}
              />

              {/* Password */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View
                      style={[
                        styles.inputBox,
                        styles.inputRow,
                        !!errors.password && styles.inputError,
                      ]}
                    >
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Password"
                        placeholderTextColor={PLACEHOLDER}
                        secureTextEntry={!showPassword}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                        <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <Text style={styles.fieldError}>{errors.password.message}</Text>
                    )}
                  </View>
                )}
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

const PLACEHOLDER = '#626262';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 40 },

  logoRow: { alignItems: 'center', paddingBottom: 8 },
  logo: { width: 210, height: 44 },

  form: { paddingHorizontal: 24, paddingTop: 40, gap: 32 },

  title: {
    fontFamily: Font.medium,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'],
    color: '#F9F9F9',
  },

  fields: { gap: 20 },

  inputBox: {
    height: 56,
    backgroundColor: '#131313',
    borderWidth: 1,
    borderColor: 'rgba(98,98,98,0.87)',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputError: { borderColor: Colors.error },
  input: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#F9F9F9',
    paddingVertical: 0,
  },
  eyeIcon: { fontSize: 16, paddingHorizontal: 4 },
  fieldError: {
    fontFamily: Font.regular,
    fontSize: FontSize.sm,
    color: Colors.error,
    marginTop: 4,
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
    color: '#F9F9F9',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(98,98,98,0.87)' },
  orText: { fontFamily: Font.medium, fontSize: FontSize.lg, color: '#626262' },

  googleBtn: {
    height: 56,
    backgroundColor: '#131313',
    borderWidth: 1,
    borderColor: 'rgba(98,98,98,0.87)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleLogo: { width: 20, height: 20 },
  googleText: { fontFamily: Font.semibold, fontSize: FontSize.md, color: '#F9F9F9' },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  bottomBase: { fontFamily: Font.medium, fontSize: FontSize.lg, color: '#F9F9F9' },
  bottomLink: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: Colors.gold,
    textDecorationLine: 'underline',
  },
});

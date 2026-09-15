import { Text } from '@/components/common/Text';
import { useAuth } from '@/hooks/useAuth';
import { staffLoginThunk } from '@/store/slices/auth.slice';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
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
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});
type Schema = z.infer<typeof schema>;

export default function StaffLoginScreen() {
  const { staffLogin, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: Schema) => {
    const result = await staffLogin({ username: data.username, password: data.password });
    if (staffLoginThunk.rejected.match(result)) {
      Toast.show({ type: 'error', text1: 'Login failed', text2: result.error.message });
    }
    // On success AuthGate routes to /(staff)
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 50 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <Image
            source={require('../../../assets/images/appLogo.png')}
            style={styles.logo}
            contentFit="contain"
          />

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.heading}>Login to your account</Text>

            <View style={styles.fields}>
              {/* Username */}
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <View style={[styles.inputBox, !!errors.username && styles.inputError]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        placeholderTextColor={PLACEHOLDER}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    </View>
                    {errors.username ? (
                      <Text style={styles.fieldError}>{errors.username.message}</Text>
                    ) : null}
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
                        placeholder="Enter your password"
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
                    {errors.password ? (
                      <Text style={styles.fieldError}>{errors.password.message}</Text>
                    ) : null}
                  </View>
                )}
              />
            </View>

            {/* Login CTA */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.btnDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.loginBtnText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Help text */}
            <Text style={styles.helpText}>
              In case you forget your password, please contact the administrator.
            </Text>

            {/* Customer login link */}
            <View style={styles.switchRow}>
              <Text style={styles.switchBase}>Customer? </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.switchLink}>Login here</Text>
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
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logo: { width: 210, height: 44, marginBottom: 0 },

  card: {
    width: '100%',
    maxWidth: 491,
    paddingTop: 40,
    gap: 32,
  },

  heading: {
    fontFamily: Font.medium,
    fontSize: FontSize['3xl'],
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

  loginBtn: {
    backgroundColor: Colors.gold,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  loginBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#F9F9F9',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  helpText: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.4,
    color: '#626262',
    textAlign: 'center',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchBase: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#F9F9F9',
  },
  switchLink: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: Colors.gold,
    textDecorationLine: 'underline',
  },
});

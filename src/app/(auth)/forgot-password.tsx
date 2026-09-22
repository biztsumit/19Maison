import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthPhoneField } from '@/components/auth/AuthFields';
import { Colors } from '@/theme/colors';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';
import { formatPhone, toE164Phone } from '@/utils/phone';
import { forgotPasswordSchema } from '@/utils/validators';
import type { ForgotPasswordSchema } from '@/utils/validators';

export default function ForgotPasswordScreen() {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  // Set once the reset has been requested, so the confirmation can name the number.
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { phone: '' },
  });

  // TODO: there is no reset endpoint yet. The form now validates the number and
  // hands over the E.164 string the API will want when it lands.
  const onSubmit = ({ phone }: ForgotPasswordSchema) => setSentTo(toE164Phone(phone));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

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
          {sentTo ? (
            <View style={styles.card}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.cardTitle}>Code sent</Text>
              <Text style={styles.cardDesc}>
                We have sent reset instructions to {formatPhone(sentTo)}. It may take a few minutes
                to arrive.
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
                Enter your registered mobile number and we&apos;ll send you a reset link.
              </Text>

              <AuthPhoneField control={control} name="phone" />

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleSubmit(onSubmit)}
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

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.authBg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerIcon: { fontSize: 22, color: c.authText, fontFamily: Font.regular },
    logoWrap: { alignItems: 'center', gap: 4 },
    logoText: { fontFamily: Font.semibold, fontSize: 14, letterSpacing: 6, color: c.authText },
    logoUnderline: { height: 2, width: 60, borderRadius: 1 },
    kav: { flex: 1 },
    content: { flex: 1, padding: 16, paddingTop: 40 },
    card: { borderWidth: 1, borderColor: c.authBorder, padding: 16, gap: 24 },
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
      color: c.authText,
      lineHeight: FontSize['2xl'],
    },
    cardDesc: {
      fontFamily: Font.regular,
      fontSize: FontSize.md,
      color: c.authTextMuted,
      lineHeight: FontSize.md * 1.6,
    },
    primaryBtn: {
      backgroundColor: Colors.gold,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
    },
    primaryBtnText: {
      fontFamily: Font.semibold,
      fontSize: FontSize.md,
      color: c.authText,
      letterSpacing: 2,
    },
    backLink: { alignItems: 'center' },
    backLinkText: { fontFamily: Font.medium, fontSize: FontSize.md, color: c.authTextMuted },
  });

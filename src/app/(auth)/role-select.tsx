import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';

const { height } = Dimensions.get('window');

export default function RoleSelectScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.iconBtn} />
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

      {/* Content */}
      <View style={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.heroSection}>
          <Text style={styles.tagline}>THE LUXURY EYEWEAR DESTINATION</Text>
          <Text style={styles.headline}>A curated world of premium frames awaits.</Text>
          <LinearGradient
            colors={['#BF953F', '#FCF6BA', '#B38728']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.accentLine}
          />
        </View>

        <View style={styles.cards}>
          {/* Customer card */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => router.push('/(auth)/login?role=customer')}
            activeOpacity={0.85}
          >
            <Text style={styles.roleIcon}>◎</Text>
            <View style={styles.roleTextGroup}>
              <Text style={styles.roleTitle}>SHOP</Text>
              <Text style={styles.roleSubtitle}>Browse & buy luxury eyewear</Text>
            </View>
            <Text style={styles.roleArrow}>→</Text>
          </TouchableOpacity>

          {/* Seller card */}
          <TouchableOpacity
            style={[styles.roleCard, styles.roleCardDark]}
            onPress={() => router.push('/(auth)/login?role=seller')}
            activeOpacity={0.85}
          >
            <Text style={[styles.roleIcon, styles.roleIconLight]}>⊞</Text>
            <View style={styles.roleTextGroup}>
              <Text style={[styles.roleTitle, styles.roleTitleLight]}>SELL</Text>
              <Text style={[styles.roleSubtitle, styles.roleSubtitleLight]}>List & manage your store</Text>
            </View>
            <Text style={[styles.roleArrow, styles.roleArrowLight]}>→</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink}>Terms & Privacy Policy</Text>
        </Text>
      </View>
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
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorder,
  },
  iconBtn: { width: 40, height: 40 },
  logoWrap: { alignItems: 'center', gap: 4 },
  logoText: { fontFamily: Font.semibold, fontSize: 14, letterSpacing: 6, color: Colors.textDark },
  logoUnderline: { height: 2, width: 60, borderRadius: 1 },

  content: { flex: 1, padding: 16, paddingTop: 40, gap: 40, justifyContent: 'space-between' },

  heroSection: { gap: 16 },
  tagline: {
    fontFamily: Font.semibold,
    fontSize: FontSize.xs,
    letterSpacing: 3,
    color: Colors.gold,
  },
  headline: {
    fontFamily: Font.light,
    fontSize: FontSize['4xl'],
    color: Colors.textDark,
    lineHeight: FontSize['4xl'] * 1.2,
  },
  accentLine: { height: 2, width: 48, borderRadius: 1 },

  cards: { gap: 12 },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    padding: 20,
  },
  roleCardDark: {
    backgroundColor: Colors.textDark,
    borderColor: Colors.textDark,
  },
  roleIcon: { fontSize: 28, color: Colors.textDark },
  roleIconLight: { color: Colors.white },
  roleTextGroup: { flex: 1, gap: 4 },
  roleTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: Colors.textDark,
    letterSpacing: 3,
  },
  roleTitleLight: { color: Colors.white },
  roleSubtitle: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: Colors.textGray,
  },
  roleSubtitleLight: { color: 'rgba(255,255,255,0.6)' },
  roleArrow: { fontSize: 20, color: Colors.textDark },
  roleArrowLight: { color: Colors.gold },

  footerText: {
    fontFamily: Font.regular,
    fontSize: FontSize.sm,
    color: Colors.textGray,
    textAlign: 'center',
  },
  footerLink: {
    fontFamily: Font.medium,
    color: Colors.gold,
    textDecorationLine: 'underline',
  },
});

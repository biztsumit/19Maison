import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';
import { useAuth } from '@/hooks/useAuth';

// ── Menu items ─────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  {
    label: 'Profile',
    subtitle: 'Manage your personal information',
    route: '/(customer)/profile-edit' as const,
    icon: { ios: 'person.fill', android: 'person', fallback: '👤' },
  },
  {
    label: 'Orders',
    subtitle: 'Track and manage your orders',
    route: '/(customer)/orders' as const,
    icon: { ios: 'bag.fill', android: 'shopping_bag', fallback: '🛍' },
  },
  {
    label: 'Wishlist',
    subtitle: 'Your saved items',
    route: '/(customer)/wishlist' as const,
    icon: { ios: 'heart.fill', android: 'favorite', fallback: '♥' },
  },
  {
    label: 'Contact Us',
    subtitle: 'Get help and support',
    route: '/(customer)/contact' as const,
    icon: { ios: 'phone.fill', android: 'phone', fallback: '📞' },
  },
] as const;

// ── Screen ─────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, displayName, logout } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ── Black header — name + phone ───────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        {displayName ? (
          <Text style={styles.userName} numberOfLines={1}>
            {displayName}
          </Text>
        ) : (
          <Text style={styles.userName}>My Account</Text>
        )}
        {user?.phone ? (
          <Text style={styles.userPhone}>{user.phone}</Text>
        ) : null}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Menu card ──────────────────────────────────────────────── */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => router.push(item.route)}
              activeOpacity={0.7}
            >
              {/* Dark icon box */}
              <View style={styles.iconBox}>
                <SymbolView
                  name={Platform.OS === 'ios' ? item.icon.ios : (item.icon.android as any)}
                  size={20}
                  tintColor="#FFFFFF"
                  fallback={<Text style={styles.iconFallback}>{item.icon.fallback}</Text>}
                />
              </View>

              {/* Text */}
              <View style={styles.menuText}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>

              {/* Chevron */}
              <SymbolView
                name="chevron.right"
                size={14}
                tintColor="#000000"
                fallback={<Text style={styles.menuArrow}>›</Text>}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Logout button ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={logout}
          activeOpacity={0.7}
        >
          <SymbolView
            name="rectangle.portrait.and.arrow.right"
            size={18}
            tintColor="#FB1B00"
            fallback={<Text style={styles.logoutIcon}>⎋</Text>}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 24, gap: 16, paddingBottom: 48 },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontFamily: Font.semibold,
    fontSize: 22,
    color: '#E5E2DF',
    lineHeight: 28,
    textAlign: 'center',
  },
  userPhone: {
    fontFamily: Font.regular,
    fontSize: FontSize.sm,
    color: '#D0C5AF',
    opacity: 0.8,
    textAlign: 'center',
  },

  // ── Menu card ─────────────────────────────────────────────────────────────
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(77,70,53,0.1)',
  },

  // Icon box
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1C1C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFallback: {
    fontSize: 18,
    lineHeight: 22,
  },

  // Text
  menuText: { flex: 1, gap: 2 },
  menuLabel: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#000000',
    lineHeight: FontSize.md * 1.3,
  },
  menuSubtitle: {
    fontFamily: Font.regular,
    fontSize: 13,
    color: '#000000',
    opacity: 0.7,
    lineHeight: 13 * 1.3,
  },
  menuArrow: {
    fontSize: 22,
    color: '#000000',
    lineHeight: 26,
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  logoutIcon: {
    fontSize: 18,
    color: '#FB1B00',
  },
  logoutText: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#FB1B00',
    lineHeight: FontSize.md,
  },
});

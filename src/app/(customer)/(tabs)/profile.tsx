import { StyleSheet, View } from 'react-native';
import { useConfirm } from '@/providers/ConfirmProvider';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, CustomerScreen, Text } from '@/components/customer';
import { MenuRow } from '@/components/customer/account/MenuRow';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { selectWishlistCount } from '@/store/selectors/wishlist.selectors';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';

export default function ProfileScreen() {
  const confirm = useConfirm();
  const { user, displayName, logout } = useAuth();
  const wishlistCount = useAppSelector(selectWishlistCount);
  const insets = useSafeAreaInsets();

  const confirmLogout = async () => {
    const ok = await confirm({
      title: 'Log out',
      message: 'Are you sure you want to log out?',
      confirmLabel: 'Log out',
      destructive: true,
    });
    if (ok) logout();
  };

  // The dark hero runs under the status bar, so it owns the top inset.
  return (
    <CustomerScreen background="offWhite" edges={{ top: false }}>
      <View style={[styles.hero, { paddingTop: insets.top + Spacing[8] }]}>
        <Text variant="screenTitle" tone="inverse">
          {displayName || 'Welcome'}
        </Text>
        {Boolean(user?.phone) && (
          <Text variant="bodySmall" tone="inverseMuted">
            {user?.phone}
          </Text>
        )}
      </View>

      <View style={styles.menu}>
        <MenuRow
          icon="user"
          label="Profile"
          subtitle="Manage your details and addresses"
          onPress={() => router.push('/(customer)/profile-edit')}
        />
        <MenuRow
          icon="bag"
          label="Orders"
          subtitle="Track and manage your orders"
          onPress={() => router.push('/(customer)/orders')}
        />
        <MenuRow
          icon="heart"
          label="Wishlist"
          subtitle="Your saved items"
          badge={wishlistCount}
          onPress={() => router.push('/(customer)/wishlist')}
        />
        <MenuRow
          icon="phone"
          label="Contact us"
          subtitle="Get help and support"
          onPress={() => router.push('/(customer)/contact')}
        />
      </View>

      <View style={styles.footer}>
        <Button label="Log out" variant="outline" onPress={confirmLogout} fullWidth />
      </View>
    </CustomerScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: Spacing[1],
    backgroundColor: CustomerColors.bgDark,
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingBottom: Spacing[8],
  },
  menu: {
    backgroundColor: CustomerColors.bg,
    marginTop: Spacing[5],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CustomerColors.border,
  },
  footer: { padding: CustomerLayout.screenPaddingH, marginTop: Spacing[6] },
});

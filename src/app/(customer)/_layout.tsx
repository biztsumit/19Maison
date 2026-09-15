import { Text } from '@/components/common/Text';
import { useAppSelector } from '@/store';
import { selectCartItemCount } from '@/store/selectors/cart.selectors';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Tab icon definitions ──────────────────────────────────────────────────
// Figma: 5 tabs — Home, Explore, Category, Cart, Profile
// Active label: #D4AF37 gold | Inactive: #000000 black
const TAB_ICONS = {
  home: {
    ios: { active: 'house.fill', inactive: 'house' },
    android: { active: 'home', inactive: 'home' },
  },
  explore: {
    ios: { active: 'photo.on.rectangle.fill', inactive: 'photo.on.rectangle' },
    android: { active: 'image_search', inactive: 'image_search' },
  },
  category: {
    ios: { active: 'square.grid.2x2.fill', inactive: 'square.grid.2x2' },
    android: { active: 'dashboard_2', inactive: 'dashboard_2' },
  },
  cart: {
    ios: { active: 'cart.fill.badge.plus', inactive: 'cart.badge.plus' },
    android: { active: 'add_shopping_cart', inactive: 'add_shopping_cart' },
  },
  profile: {
    ios: { active: 'person.fill', inactive: 'person' },
    android: { active: 'person', inactive: 'person_outline' },
  },
} as const;

// ── TabIcon ───────────────────────────────────────────────────────────────
function TabIcon({
  label,
  tab,
  focused,
  badgeCount,
}: {
  label: string;
  tab: keyof typeof TAB_ICONS;
  focused: boolean;
  badgeCount?: number;
}) {
  const icons = TAB_ICONS[tab];
  const tintColor = focused ? Colors.gold : Colors.textDark;

  const symbolName = {
    ios: focused ? icons.ios.active : icons.ios.inactive,
    android: focused ? icons.android.active : icons.android.inactive,
  };

  return (
    <View style={styles.tabItem}>
      <View style={styles.iconWrap}>
        <SymbolView
          name={symbolName as any}
          size={28}
          tintColor={tintColor}
          weight="regular"
          fallback={
            <Text style={[styles.fallbackIcon, { color: tintColor }]}>
              {tab === 'home' ? '⌂' : tab === 'explore' ? '⊞' : tab === 'category' ? '▦' : tab === 'cart' ? '⊟' : '◯'}
            </Text>
          }
        />
        {!!badgeCount && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount > 9 ? '9+' : String(badgeCount)}</Text>
          </View>
        )}
      </View>
      {/* Figma: Poppins Medium 12px, active gold, inactive black */}
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────
export default function CustomerLayout() {
  const insets = useSafeAreaInsets();
  const cartCount = useAppSelector(selectCartItemCount);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Figma: rgba(255,255,255,0.15) blur — approximate with near-opaque white; 5 tabs
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: Math.max(insets.bottom, 8) },
        ],
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textDark,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Home" tab="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Explore" tab="explore" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Category" tab="category" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Cart" tab="cart" focused={focused} badgeCount={cartCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Profile" tab="profile" focused={focused} />,
        }}
      />

      {/* Hidden routes — not shown in tab bar */}
      <Tabs.Screen name="wishlist" options={{ href: null }} />
      <Tabs.Screen name="product/[id]" options={{ href: null }} />
      <Tabs.Screen name="checkout/index" options={{ href: null }} />
      <Tabs.Screen name="order/[id]" options={{ href: null }} />
      <Tabs.Screen name="order-success" options={{ href: null }} />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="profile-edit" options={{ href: null }} />
      <Tabs.Screen name="contact" options={{ href: null }} />
    </Tabs>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Figma: padding 16px 24px 40px, bg rgba(255,255,255,0.15) blur
  tabBar: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 0,
    height: Platform.select({ ios: 80, android: 68 }),
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 64,
  },

  iconWrap: {
    position: 'relative',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fallbackIcon: { fontSize: 24, lineHeight: 28 },

  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: Font.bold,
    fontSize: 9,
    color: Colors.white,
  },

  // Figma: Poppins Medium 12/100%, active #D4AF37, inactive #000000
  tabLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    color: Colors.textDark,
    lineHeight: FontSize.sm,
  },
  tabLabelActive: { color: Colors.gold },
});

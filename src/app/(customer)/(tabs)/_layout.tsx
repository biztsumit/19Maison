import { Tabs } from 'expo-router';
import {
  TabBarBackground,
  TabBarIcon,
  TabBarInsetContext,
  useTabBarStyle,
} from '@/components/customer/layout/TabBar';
import { useAppSelector } from '@/store';
import { selectCartItemCount } from '@/store/selectors/cart.selectors';
import { useThemeColors } from '@/theme/theme-provider';

export default function CustomerTabsLayout() {
  const colors = useThemeColors();
  const cartCount = useAppSelector(selectCartItemCount);
  const { bar, inset } = useTabBarStyle();

  return (
    // The bar is absolutely positioned so the page shows through it, which means
    // screens have to reserve this much room at the bottom of their content.
    <TabBarInsetContext.Provider value={inset}>
      <Tabs
        // Back from a non-first tab returns to the previously focused tab rather
        // than jumping to Home. Detail screens live in the parent Stack.
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarStyle: bar,
          tabBarBackground: TabBarBackground,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => <TabBarIcon label="Home" name="home" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon label="Explore" name="explore" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="category"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon label="Category" name="category" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon label="Cart" name="cart" focused={focused} badgeCount={cartCount} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon label="Profile" name="profile" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </TabBarInsetContext.Provider>
  );
}

import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { FontSize, LetterSpacing } from '@/theme/typography';
import { Text } from '@/components/common/Text';

function TabIcon({ label, icon, focused }: { label: string; icon: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function SellerLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { paddingBottom: insets.bottom }],
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Dashboard" icon="▦" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="products/index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Products" icon="⊞" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders/index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Orders" icon="◻" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="analytics/index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Analytics" icon="⌖" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Settings" icon="◈" focused={focused} />,
        }}
      />
      {/* Hidden from tab bar */}
      <Tabs.Screen name="products/add" options={{ href: null }} />
      <Tabs.Screen name="products/[id]" options={{ href: null }} />
      <Tabs.Screen name="orders/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: Platform.select({ ios: 80, android: 65 }),
    paddingTop: Spacing[2],
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[0.5],
  },
  icon: {
    fontSize: 22,
    color: Colors.textMuted,
  },
  iconFocused: {
    color: Colors.amber,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase',
  },
  tabLabelFocused: {
    color: Colors.amber,
  },
});

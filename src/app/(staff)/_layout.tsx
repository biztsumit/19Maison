import { Stack } from 'expo-router';

// Tabs live one level down in the (tabs) group so detail screens push over them.
// See the note in (customer)/_layout.tsx — a tab navigator has no back stack.
// (tabs) is a route group, so every existing URL is unchanged.
export default function StaffLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="product/[id]" />
      <Stack.Screen name="checkout/index" />
      {/* Terminal screen — back must not re-enter checkout. */}
      <Stack.Screen name="checkout/success" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

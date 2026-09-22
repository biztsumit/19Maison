import { Stack } from 'expo-router';

// Tabs live one level down in the (tabs) group so that detail screens can be
// pushed *over* them: a tab navigator has no back stack, so registering detail
// routes as hidden tabs made Android back fall through to the first tab (Home)
// and made pushing product → product impossible.
//
// (tabs) is a route group, so every existing URL is unchanged.
export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="product/[id]" />
      <Stack.Screen name="checkout/index" />
      <Stack.Screen name="order/[id]" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="wishlist" />
      <Stack.Screen name="profile-edit" />
      <Stack.Screen name="contact" />
      {/* Post-payment results are terminal — back must not re-enter checkout. */}
      <Stack.Screen name="order-success" options={{ gestureEnabled: false }} />
      <Stack.Screen name="order-failure" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

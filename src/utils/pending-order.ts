import AsyncStorage from '@react-native-async-storage/async-storage';

// A payment can be interrupted by the Razorpay sheet being dismissed, or by the OS
// killing the app while that sheet is foregrounded. Persisting the reserved order id
// lets the retry resume it instead of creating a second order for the same basket.
//
// AsyncStorage rather than SecureStore: an order id is not a secret, and iOS keychain
// entries survive app uninstall, which is the opposite of what this needs.
//
// Every operation here is best-effort. Resuming is an optimisation, so a storage
// failure must degrade to "create a new order", never block checkout.

const KEY = '@19maison:pending_order';

// Long enough for a slow UPI/bank redirect, short enough that a forgotten order
// is never silently resumed days later against a different basket.
const TTL_MS = 30 * 60 * 1000;

interface PendingOrder {
  orderId: string;
  cartSignature: string;
  createdAt: number;
}

// Stable identity for the basket the order was created from. Resuming is only safe
// while the cart still matches; otherwise the user would pay for the old contents.
export function cartSignature(items: { variant: { id: string }; quantity: number }[]): string {
  return items
    .map(i => `${i.variant.id}:${i.quantity}`)
    .sort()
    .join('|');
}

export async function savePendingOrder(orderId: string, signature: string): Promise<void> {
  const payload: PendingOrder = { orderId, cartSignature: signature, createdAt: Date.now() };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Losing the marker only costs us resume-on-retry.
  }
}

export async function loadPendingOrder(signature: string): Promise<string | null> {
  let raw: string | null = null;
  try {
    raw = await AsyncStorage.getItem(KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  let parsed: PendingOrder;
  try {
    parsed = JSON.parse(raw) as PendingOrder;
  } catch {
    await clearPendingOrder();
    return null;
  }

  const expired = Date.now() - parsed.createdAt > TTL_MS;
  if (expired || parsed.cartSignature !== signature || !parsed.orderId) {
    await clearPendingOrder();
    return null;
  }

  return parsed.orderId;
}

export async function clearPendingOrder(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // A stale marker is harmless: it is TTL- and signature-guarded on read.
  }
}

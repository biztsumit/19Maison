import { useCallback, useState } from 'react';
import { NativeModules, TurboModuleRegistry } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { PaymentService } from '@/api/services/payment.service';
import { useAppDispatch } from '@/store';
import { clearCartThunk } from '@/store/slices/cart.slice';
import { orderKeys } from '@/hooks/useOrders';
import {
  cartSignature,
  clearPendingOrder,
  loadPendingOrder,
  savePendingOrder,
} from '@/utils/pending-order';
import type { CartItem } from '@/types';

// Resolved once at module load. The previous implementation required the SDK
// *after* creating the order, which orphaned a RESERVED order every time the
// native module was missing (Expo Go).
const RazorpaySDK: { open: (options: object) => Promise<RazorpaySuccess> } | null = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-razorpay').default;
  } catch {
    return null;
  }
})();

// Importing the JS wrapper proves nothing: react-native-razorpay is plain JS that
// resolves NativeModules.RNRazorpayCheckout at module scope, and its
// `new NativeEventEmitter(undefined)` only throws on iOS — RN skips that invariant
// on Android. So on Android without a dev build the require above succeeds, and
// open() later dies on `Cannot read property 'open' of undefined` *after* an order
// has already been reserved. Probe the native module itself instead.
const hasNativeRazorpay = (() => {
  try {
    if (TurboModuleRegistry.get('RNRazorpayCheckout') != null) return true;
  } catch {
    // Not a TurboModule build; fall through to the legacy bridge.
  }
  return NativeModules.RNRazorpayCheckout != null;
})();

export const isOnlinePaymentAvailable = RazorpaySDK !== null && hasNativeRazorpay;

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Razorpay's numeric codes are not publicly documented per-value, so this reads
// the description rather than guessing a code table. A cancellation needs no
// explanation; anything else does.
function razorpayFailureReason(err: unknown): string | undefined {
  const raw = err as { code?: number | string; description?: string; message?: string } | null;
  const description = raw?.description?.trim();
  const message = raw?.message?.trim();

  if (description && /cancel/i.test(description)) return undefined;

  if (description) {
    return raw?.code != null ? `${description} (code ${raw.code})` : description;
  }
  // A TypeError from the wrapper means the native module is not in this build.
  if (message && /undefined|not a function|null/i.test(message)) {
    return 'Razorpay is not available in this build. Install a dev build that includes it.';
  }
  return message || 'The payment sheet could not be opened.';
}

export type CheckoutState =
  | { status: 'idle' }
  | { status: 'placing' }
  | { status: 'initiating'; orderId: string }
  | { status: 'checkout_open'; orderId: string }
  | { status: 'verifying'; orderId: string }
  | { status: 'placing_cod'; orderId: string }
  // Sheet closed, card declined, or the sheet never opened. The order stays
  // reserved either way, so a retry resumes it — but say which it was.
  | { status: 'dismissed'; orderId: string; reason?: string }
  | { status: 'failed'; error: string; orderId?: string };

const BUSY: CheckoutState['status'][] = [
  'placing',
  'initiating',
  'checkout_open',
  'verifying',
  'placing_cod',
];

export function payButtonLabel(state: CheckoutState): string {
  switch (state.status) {
    case 'placing':
      return 'Placing order...';
    case 'initiating':
      return 'Preparing payment...';
    case 'checkout_open':
      return 'Opening checkout...';
    case 'verifying':
      return 'Verifying payment...';
    case 'placing_cod':
      return 'Confirming order...';
    case 'dismissed':
      return 'Try again';
    default:
      return 'Pay now';
  }
}

export type PaymentMethod = 'RAZORPAY' | 'CASH_ON_DELIVERY';

interface PayArgs {
  addressId: string;
  items: CartItem[];
  method: PaymentMethod;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export function useCheckout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [state, setState] = useState<CheckoutState>({ status: 'idle' });

  const isBusy = BUSY.includes(state.status);

  // order-success fetches the order by id, so passing the number and total as
  // params was dead weight — and they were empty anyway whenever a dismissed
  // payment was resumed, since only the create branch ever set them.
  const finishSuccess = useCallback(
    async (orderId: string, method: 'RAZORPAY' | 'COD') => {
      await clearPendingOrder();
      await dispatch(clearCartThunk());
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      setState({ status: 'idle' });
      router.replace({
        pathname: '/(customer)/order-success',
        params: { orderId, method },
      });
    },
    [dispatch, queryClient],
  );

  const pay = useCallback(
    async ({
      addressId,
      items,
      method,
      notes,
      customerName,
      customerPhone,
      customerEmail,
    }: PayArgs) => {
      if (!addressId || items.length === 0) return;

      // Only the online path needs the native SDK; COD is server-side only.
      if (method === 'RAZORPAY' && !isOnlinePaymentAvailable) {
        setState({
          status: 'failed',
          error: 'Online payment needs a dev build with Razorpay, not Expo Go.',
        });
        return;
      }

      const signature = cartSignature(items);

      try {
        // Resume an order already reserved for this exact basket rather than
        // creating a second one.
        let orderId = state.status === 'dismissed' ? state.orderId : null;

        if (!orderId) orderId = await loadPendingOrder(signature);

        if (!orderId) {
          setState({ status: 'placing' });
          // Same payload the web client sends: address, bare items, notes. It
          // omits fulfillmentType, so the server defaults it.
          const created = await PaymentService.createOrder({
            addressId,
            items: items.map(item => ({
              variantId: item.variant.id,
              quantity: item.quantity,
            })),
            notes: notes?.trim() || undefined,
          });
          orderId = created.id;
          await savePendingOrder(orderId, signature);
        }

        setState({ status: 'initiating', orderId });
        // The online path omits `method` so the request matches the production web
        // client byte for byte; the server defaults it to Razorpay. COD sends it
        // explicitly — the backend settles the order on this call and there is no
        // verify step, so nothing further is needed.
        const payment = await PaymentService.initiatePayment(
          method === 'CASH_ON_DELIVERY' ? { orderId, method } : { orderId },
        );

        if (method === 'CASH_ON_DELIVERY') {
          setState({ status: 'placing_cod', orderId });
          await finishSuccess(orderId, 'COD');
          return;
        }

        // Opening the sheet without these fails inside the native SDK, where the
        // reason is far harder to read than it is here.
        if (!payment?.razorpayOrderId || !payment?.keyId || payment.amount == null) {
          throw new Error(
            'Payment could not be started: the server did not return a Razorpay order.',
          );
        }

        setState({ status: 'checkout_open', orderId });

        let result: RazorpaySuccess;
        try {
          result = await RazorpaySDK!.open({
            description: 'Order payment',
            currency: payment.currency ?? 'INR',
            key: payment.keyId,
            amount: String(payment.amount),
            order_id: payment.razorpayOrderId,
            name: '19 Maison',
            prefill: {
              name: customerName ?? '',
              contact: (customerPhone ?? '').replace(/\D/g, ''),
              email: customerEmail ?? '',
            },
            theme: { color: '#D4AF37' },
          });
        } catch (err) {
          // Razorpay rejects with { code, description } when the user closes the
          // sheet or a payment fails, but a missing native module rejects with a
          // TypeError from deep inside the wrapper. Both used to be reported as a
          // plain dismissal, which is why "sheet never opened" looked identical to
          // "user cancelled". Retrying is still safe in every case — the order is
          // reserved — so keep the state and attach the reason.
          if (__DEV__) console.warn('[razorpay] checkout did not complete:', err);
          setState({ status: 'dismissed', orderId, reason: razorpayFailureReason(err) });
          return;
        }

        setState({ status: 'verifying', orderId });
        try {
          await PaymentService.verifyPayment({
            razorpayOrderId: result.razorpay_order_id,
            razorpayPaymentId: result.razorpay_payment_id,
            razorpaySignature: result.razorpay_signature,
          });
        } catch {
          // Razorpay reported success but verification failed, so money may have
          // been captured. Never offer a plain retry here.
          await clearPendingOrder();
          setState({ status: 'idle' });
          router.replace({ pathname: '/(customer)/order-failure', params: { orderId } });
          return;
        }

        await finishSuccess(orderId, 'RAZORPAY');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        setState({ status: 'failed', error: message });
      }
    },
    [state, finishSuccess],
  );

  const dismissError = useCallback(() => setState({ status: 'idle' }), []);

  return { state, isBusy, pay, dismissError, payButtonLabel: payButtonLabel(state) };
}

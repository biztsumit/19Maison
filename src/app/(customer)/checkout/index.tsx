import {
  Accordion,
  BottomSheet,
  Button,
  CustomerHeader,
  CustomerScreen,
  Divider,
  EmptyState,
  Input,
  Skeleton,
  StickyActionBar,
  Text,
} from '@/components/customer';
import { CartSummary } from '@/components/customer/cart/CartSummary';
import { AddressOption } from '@/components/customer/checkout/AddressOption';
import { CheckoutStateBanner } from '@/components/customer/checkout/CheckoutStateBanner';
import { DeliveryAddressForm } from '@/components/customer/checkout/DeliveryAddressForm';
import { OrderLineItem, cartItemToLine } from '@/components/customer/checkout/OrderLineItem';
import { SelectionBox } from '@/components/customer/ui/SelectionBox';
import { useAddresses, useCreateAddress } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { isOnlinePaymentAvailable, useCheckout } from '@/hooks/useCheckout';
import type { PaymentMethod } from '@/hooks/useCheckout';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import type { AddressRequest } from '@/types/user.types';
import { ORDER_NOTES_MAX, orderNotesSchema } from '@/utils/validators';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

// Cash on delivery goes through POST /payments/initiate with
// method: 'CASH_ON_DELIVERY', which the backend team confirmed settles the order on
// that call. The web storefront has no COD path at all, so this is the one place
// mobile intentionally diverges from it.

export default function CheckoutScreen() {
  const styles = useThemedStyles(makeStyles);
  const { user, displayName } = useAuth();
  const { cart, items, total, fetchCart } = useCart();
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const checkout = useCheckout();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Razorpay needs a dev build; falling back to COD keeps checkout usable without one.
  const [method, setMethod] = useState<PaymentMethod>(
    isOnlinePaymentAvailable ? 'RAZORPAY' : 'CASH_ON_DELIVERY',
  );

  const [note, setNote] = useState('');

  // Bounded because the courier API truncates anything longer, which would drop
  // part of a gift message without telling anyone.
  const noteCheck = orderNotesSchema.safeParse({ notes: note });
  const noteError = noteCheck.success ? undefined : noteCheck.error.issues[0]?.message;
  const [addressSheet, setAddressSheet] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Seed from the default address once, without overriding a deliberate pick.
  useEffect(() => {
    if (selectedId || addresses.length === 0) return;
    setSelectedId((addresses.find(a => a.isDefault) ?? addresses[0]).id);
  }, [addresses, selectedId]);

  const handleSaveAddress = async (data: AddressRequest) => {
    try {
      const created = await createAddress.mutateAsync({
        ...data,
        isDefault: data.isDefault || addresses.length === 0,
      });
      setSelectedId(created.id);
      setAddressSheet(false);
    } catch {
      Toast.show({ type: 'error', text1: 'Could not save address' });
    }
  };

  const handlePay = () =>
    checkout.pay({
      addressId: selectedId as string,
      items,
      method,
      notes: note.trim(),
      customerName: displayName ?? undefined,
      customerPhone: user?.phone,
      customerEmail: user?.email,
    });

  const header = <CustomerHeader variant="back" title="Checkout" />;

  if (items.length === 0) {
    return (
      <CustomerScreen header={header} scroll={false}>
        <EmptyState
          icon="bag"
          title="Nothing to check out"
          message="Your bag is empty."
          actionLabel="Shop now"
          onAction={() => router.replace('/(customer)/(tabs)/explore')}
        />
      </CustomerScreen>
    );
  }

  const hasAddresses = addresses.length > 0;

  return (
    <CustomerScreen
      header={header}
      footer={
        <StickyActionBar>
          <Button
            label={checkout.payButtonLabel}
            onPress={handlePay}
            loading={checkout.isBusy}
            disabled={!selectedId || checkout.isBusy || Boolean(noteError)}
            fullWidth
          />
        </StickyActionBar>
      }
    >
      <View style={styles.body}>
        <Text variant="sectionHeading">Delivery address</Text>

        {addressesLoading ? (
          <View style={styles.list}>
            <Skeleton height={110} />
            <Skeleton height={110} />
          </View>
        ) : hasAddresses ? (
          <>
            <View style={styles.list}>
              {addresses.map((address, index) => (
                <AddressOption
                  key={address.id}
                  address={address}
                  index={index}
                  selected={address.id === selectedId}
                  onSelect={setSelectedId}
                  disabled={checkout.isBusy}
                />
              ))}
            </View>
            <Pressable onPress={() => setAddressSheet(true)} hitSlop={8} accessibilityRole="button">
              <Text variant="link">Add a new address</Text>
            </Pressable>
          </>
        ) : (
          // Mirrors the web: first-time buyers fill the form inline rather than
          // being sent out of the checkout flow.
          <DeliveryAddressForm
            onSubmit={handleSaveAddress}
            isSubmitting={createAddress.isPending}
          />
        )}

        <Divider />

        <Text variant="sectionHeading">Payment method</Text>
        <View style={styles.list}>
          <Pressable
            onPress={() => setMethod('RAZORPAY')}
            disabled={!isOnlinePaymentAvailable || checkout.isBusy}
            accessibilityRole="radio"
            accessibilityState={{
              selected: method === 'RAZORPAY',
              disabled: !isOnlinePaymentAvailable,
            }}
            style={[styles.method, !isOnlinePaymentAvailable && styles.methodDisabled]}
          >
            <View style={styles.methodText}>
              <Text variant="cardTitle">Pay online</Text>
              <Text variant="caption">
                {isOnlinePaymentAvailable
                  ? 'Card, UPI, netbanking or wallet'
                  : 'Needs a dev build with Razorpay'}
              </Text>
            </View>
            <SelectionBox selected={method === 'RAZORPAY'} />
          </Pressable>

          <Pressable
            onPress={() => setMethod('CASH_ON_DELIVERY')}
            disabled={checkout.isBusy}
            accessibilityRole="radio"
            accessibilityState={{ selected: method === 'CASH_ON_DELIVERY' }}
            style={styles.method}
          >
            <View style={styles.methodText}>
              <Text variant="cardTitle">Cash on delivery</Text>
              <Text variant="caption">Pay when your order arrives</Text>
            </View>
            <SelectionBox selected={method === 'CASH_ON_DELIVERY'} />
          </Pressable>
        </View>

        <Divider />

        <Text variant="sectionHeading">Order summary</Text>
        <View style={styles.list}>
          {items.map(item => (
            <OrderLineItem key={item.id} line={cartItemToLine(item)} />
          ))}
        </View>

        <Accordion label="Add a note">
          <Input
            value={note}
            onChangeText={setNote}
            placeholder="Delivery instructions or a gift message"
            error={noteError}
            maxLength={ORDER_NOTES_MAX}
            multiline
          />
        </Accordion>
      </View>

      <CheckoutStateBanner state={checkout.state} onDismiss={checkout.dismissError} />

      <CartSummary
        subtotal={cart?.subtotal ?? 0}
        discount={cart?.couponDiscount ?? cart?.discount ?? 0}
        shipping={cart?.shipping}
        tax={cart?.tax}
        total={total}
        itemCount={items.length}
      />

      <BottomSheet
        visible={addressSheet}
        onClose={() => setAddressSheet(false)}
        title="Add address"
        snap="full"
      >
        <View style={styles.sheetBody}>
          <DeliveryAddressForm
            onSubmit={handleSaveAddress}
            isSubmitting={createAddress.isPending}
          />
        </View>
      </BottomSheet>
    </CustomerScreen>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    body: {
      gap: Spacing[4],
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[5],
    },
    list: { gap: Spacing[3] },
    method: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing[3],
      padding: Spacing[4],
      borderWidth: 1,
      borderColor: c.border,
    },
    methodDisabled: { opacity: 0.5 },
    methodText: { flex: 1, gap: Spacing[0.5] },
    sheetBody: { padding: CustomerLayout.screenPaddingH },
  });

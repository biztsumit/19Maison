import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import Toast from 'react-native-toast-message';
import { Text } from '@/components/common/Text';
import { useCart } from '@/hooks/useCart';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/selectors/auth.selectors';
import { PaymentService } from '@/api/services/payment.service';
import { formatPrice } from '@/utils/formatters';
import { Font, FontSize } from '@/theme/typography';

// ── Types ──────────────────────────────────────────────────────────────────

type PaymentMethod = 'RAZORPAY' | 'CASH_ON_DELIVERY';

interface AddressForm {
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  saveInfo: boolean;
  emailOffers: boolean;
}

const EMPTY_FORM: AddressForm = {
  firstName: '', lastName: '', address: '', apartment: '',
  city: '', state: '', zip: '', phone: '',
  saveInfo: false, emailOffers: false,
};

type FlowStep = 'idle' | 'creating_order' | 'initiating_payment' | 'payment_open' | 'verifying' | 'done';

const POLICIES = ['Refund policy', 'Shipping policy', 'Privacy policy', 'Terms of service', 'Contact Us'];

// ── Field component ────────────────────────────────────────────────────────

function FieldInput({
  label, value, onChangeText, placeholder, required = false,
  keyboardType, half = false,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder: string; required?: boolean; keyboardType?: any; half?: boolean;
}) {
  return (
    <View style={[fieldStyles.wrapper, half && { flex: 1 }]}>
      <Text style={fieldStyles.label}>{label}{required ? '*' : ''}</Text>
      <View style={fieldStyles.inputBox}>
        <TextInput
          style={fieldStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#626262"
          keyboardType={keyboardType ?? 'default'}
        />
      </View>
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: { gap: 8 },
  label: { fontFamily: Font.medium, fontSize: FontSize.md, color: '#000', lineHeight: 16 },
  inputBox: { borderWidth: 1, borderColor: '#DDDDDD', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12 },
  input: { fontFamily: Font.regular, fontSize: FontSize.md, color: '#000', padding: 0, lineHeight: 21 },
});

// ── Main screen ────────────────────────────────────────────────────────────

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { cart, items, updateQuantity, removeItem, applyCoupon, fetchCart } = useCart();
  const user = useAppSelector(selectUser);

  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('RAZORPAY');
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [flowStep, setFlowStep] = useState<FlowStep>('idle');

  const setField = (key: keyof AddressForm) => (val: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const isProcessing = flowStep !== 'idle' && flowStep !== 'done';

  // ── Validation ──────────────────────────────────────────────────────────

  const validateForm = (): string | null => {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    if (!form.address.trim()) return 'Address is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.state.trim()) return 'State is required';
    if (!form.zip.trim()) return 'Zip code is required';
    if (!form.phone.trim()) return 'Phone number is required';
    if (items.length === 0) return 'Your cart is empty';
    return null;
  };

  // ── Handle apply coupon ─────────────────────────────────────────────────

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      await applyCoupon(couponCode.trim());
      Toast.show({ type: 'success', text1: 'Coupon applied' });
      setCouponOpen(false);
    } catch {
      Toast.show({ type: 'error', text1: 'Invalid coupon code' });
    }
  };

  // ── Full payment flow ────────────────────────────────────────────────────

  const handlePay = async () => {
    const validationError = validateForm();
    if (validationError) {
      Toast.show({ type: 'error', text1: validationError });
      return;
    }

    try {
      // ── Step 1: Create order ───────────────────────────────────────────
      setFlowStep('creating_order');
      const orderItems = items.map(item => ({
        variantId: item.variant.id,
        quantity: item.quantity,
        fulfillmentType: 'WAREHOUSE' as const,
        // warehouseId would come from product data in a real implementation
      }));

      const createdOrder = await PaymentService.createOrder({
        items: orderItems,
        notes: note.trim() || undefined,
      });

      console.log('[Checkout] Order created:', createdOrder.id, createdOrder.orderNumber);

      // ── Step 2: Initiate payment ───────────────────────────────────────
      setFlowStep('initiating_payment');
      const paymentData = await PaymentService.initiatePayment({
        orderId: createdOrder.id,
        method: paymentMethod,
      });

      console.log('[Checkout] Payment initiated, razorpayOrderId:', paymentData.razorpayOrderId);

      // ── COD path: no SDK needed ────────────────────────────────────────
      if (paymentMethod === 'CASH_ON_DELIVERY') {
        setFlowStep('done');
        await fetchCart();
        router.replace({
          pathname: '/(customer)/order-success',
          params: {
            orderId: createdOrder.id,
            orderNumber: createdOrder.orderNumber,
            total: createdOrder.totalAmount,
            method: 'COD',
          },
        });
        return;
      }

      // ── Step 3: Open Razorpay SDK ──────────────────────────────────────
      setFlowStep('payment_open');
      let RazorpayCheckout: any;
      try {
        RazorpayCheckout = require('react-native-razorpay').default;
      } catch {
        setFlowStep('idle');
        Toast.show({ type: 'error', text1: 'Payment unavailable', text2: 'Install the dev build to pay online.' });
        return;
      }
      const razorpayOptions = {
        description: 'Order Payment',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: paymentData.currency ?? 'INR',
        key: paymentData.keyId,
        amount: String(paymentData.amount),
        order_id: paymentData.razorpayOrderId,
        name: '19 Maison',
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          contact: form.phone.replace(/\D/g, ''),
          email: user?.email ?? '',
        },
        theme: { color: '#000000' },
      };

      let razorpayResponse: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      };

      try {
        razorpayResponse = await RazorpayCheckout.open(razorpayOptions) as typeof razorpayResponse;
      } catch (razorpayError: any) {
        // User dismissed or payment failed on Razorpay end
        const code = razorpayError?.code;
        const desc = razorpayError?.description ?? 'Payment was cancelled or failed.';
        console.log('[Checkout] Razorpay error code:', code, 'desc:', desc);
        setFlowStep('idle');
        if (code !== 0) {
          // code 0 = user dismissed — show a gentle message
          Toast.show({ type: 'error', text1: 'Payment failed', text2: desc });
        }
        return;
      }

      // ── Step 4: Verify payment ─────────────────────────────────────────
      setFlowStep('verifying');
      await PaymentService.verifyPayment({
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
      });

      console.log('[Checkout] Payment verified, order PAID');
      setFlowStep('done');
      await fetchCart();
      router.replace({
        pathname: '/(customer)/order-success',
        params: {
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          total: createdOrder.totalAmount,
          method: 'RAZORPAY',
        },
      });

    } catch (err: any) {
      setFlowStep('idle');
      const message =
        err?.response?.data?.message ??
        err?.message ??
        'Something went wrong. Please try again.';
      console.log('[Checkout] Flow error at step', flowStep, ':', message);
      Toast.show({ type: 'error', text1: 'Error', text2: message });
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const subtotal = cart?.subtotal ?? 0;
  const discount = cart?.couponDiscount ?? 0;
  const shipping = cart?.shipping ?? 0;
  const total = cart?.total ?? subtotal - discount + shipping;

  const stepLabel: Record<FlowStep, string> = {
    idle: `Pay now • ${formatPrice(total)}`,
    creating_order: 'Creating order…',
    initiating_payment: 'Initiating payment…',
    payment_open: 'Opening Razorpay…',
    verifying: 'Verifying payment…',
    done: 'Done!',
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* ── Header ───────────────────────────────────────────────────── */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8} disabled={isProcessing}>
            <SymbolView name="chevron.left" size={22} tintColor="#000" fallback={<Text style={styles.backIcon}>←</Text>} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── Cart items ────────────────────────────────────────────── */}
          <View style={styles.section}>
            {items.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.cartItemTop}>
                  <View style={styles.cartItemImage}>
                    {item.product.images?.[0]?.url ? (
                      <Image source={{ uri: item.product.images[0].url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                    ) : (
                      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }} />
                    )}
                  </View>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName} numberOfLines={2}>{item.product.name}</Text>
                    <Text style={styles.cartItemVariant}>
                      {item.variant.frameColor}{item.variant.size ? ` · ${item.variant.size}mm` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => removeItem(item.id)} hitSlop={8} disabled={isProcessing}>
                    <SymbolView name="trash" size={18} tintColor="#000" fallback={<Text style={{ fontSize: 16 }}>🗑</Text>} />
                  </TouchableOpacity>
                </View>
                <View style={styles.cartItemBottom}>
                  <View style={styles.qtyStepper}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                      disabled={isProcessing}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <View style={styles.qtyTag}>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isProcessing}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cartItemPrice}>{formatPrice(item.totalPrice)}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Payment method selector ──────────────────────────────── */}
          <View style={styles.paymentSection}>
            <Text style={styles.collapsibleTitle}>Payment Method</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'RAZORPAY' && styles.paymentOptionActive]}
                onPress={() => setPaymentMethod('RAZORPAY')}
                disabled={isProcessing}
              >
                <View style={[styles.radio, paymentMethod === 'RAZORPAY' && styles.radioActive]} />
                <View style={styles.paymentOptionContent}>
                  <Text style={styles.paymentOptionTitle}>Pay Online</Text>
                  <Text style={styles.paymentOptionSub}>Card, UPI, Net Banking via Razorpay</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paymentOption, paymentMethod === 'CASH_ON_DELIVERY' && styles.paymentOptionActive]}
                onPress={() => setPaymentMethod('CASH_ON_DELIVERY')}
                disabled={isProcessing}
              >
                <View style={[styles.radio, paymentMethod === 'CASH_ON_DELIVERY' && styles.radioActive]} />
                <View style={styles.paymentOptionContent}>
                  <Text style={styles.paymentOptionTitle}>Cash on Delivery</Text>
                  <Text style={styles.paymentOptionSub}>Pay when your order arrives</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Coupon ───────────────────────────────────────────────── */}
          <View style={styles.collapsibleSection}>
            <TouchableOpacity style={styles.collapsibleHeader} onPress={() => setCouponOpen(v => !v)} activeOpacity={0.7} disabled={isProcessing}>
              <Text style={styles.collapsibleTitle}>Discount</Text>
              <TouchableOpacity style={styles.expandBtn} onPress={() => setCouponOpen(v => !v)} disabled={isProcessing}>
                <SymbolView name={couponOpen ? 'minus' : 'plus'} size={14} tintColor="#000" fallback={<Text style={styles.expandIcon}>{couponOpen ? '−' : '+'}</Text>} />
              </TouchableOpacity>
            </TouchableOpacity>
            {couponOpen && (
              <View style={styles.collapsibleBody}>
                <View style={styles.couponInputRow}>
                  <TextInput
                    style={styles.couponInput}
                    value={couponCode}
                    onChangeText={setCouponCode}
                    placeholder="Enter Discount Coupon"
                    placeholderTextColor="#626262"
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity style={styles.couponApplyBtn} onPress={handleApplyCoupon}>
                    <SymbolView name="arrow.right" size={16} tintColor="#FFF" fallback={<Text style={{ color: '#FFF', fontSize: 16 }}>→</Text>} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* ── Add note ─────────────────────────────────────────────── */}
          <View style={styles.collapsibleSection}>
            <TouchableOpacity style={styles.collapsibleHeader} onPress={() => setNoteOpen(v => !v)} activeOpacity={0.7} disabled={isProcessing}>
              <Text style={styles.collapsibleTitle}>Add Note</Text>
              <TouchableOpacity style={styles.expandBtn} onPress={() => setNoteOpen(v => !v)} disabled={isProcessing}>
                <SymbolView name={noteOpen ? 'minus' : 'plus'} size={14} tintColor="#000" fallback={<Text style={styles.expandIcon}>{noteOpen ? '−' : '+'}</Text>} />
              </TouchableOpacity>
            </TouchableOpacity>
            {noteOpen && (
              <View style={styles.collapsibleBody}>
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add note"
                  placeholderTextColor="#626262"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}
          </View>

          {/* ── Delivery Address Form ────────────────────────────────── */}
          <View style={styles.addressSection}>
            <Text style={styles.addressTitle}>Enter Delivery Address</Text>
            <View style={styles.formGrid}>
              <FieldInput label="Country / Region" value="India" onChangeText={() => {}} placeholder="India" required />
              <View style={styles.formRow}>
                <FieldInput label="First Name" value={form.firstName} onChangeText={setField('firstName')} placeholder="Enter your first name" required half />
                <FieldInput label="Last Name" value={form.lastName} onChangeText={setField('lastName')} placeholder="Enter your last name" required half />
              </View>
              <FieldInput label="Address" value={form.address} onChangeText={setField('address')} placeholder="Enter your address" required />
              <FieldInput label="Apartment, suite, etc (optional)" value={form.apartment} onChangeText={setField('apartment')} placeholder="Enter your apartment" />
              <View style={styles.formRow}>
                <FieldInput label="City" value={form.city} onChangeText={setField('city')} placeholder="City" required half />
                <FieldInput label="State" value={form.state} onChangeText={setField('state')} placeholder="State" required half />
              </View>
              <View style={styles.formRow}>
                <FieldInput label="Zip code" value={form.zip} onChangeText={setField('zip')} placeholder="eg: 145236" required keyboardType="numeric" half />
                <FieldInput label="Phone number" value={form.phone} onChangeText={setField('phone')} placeholder="+91 XXXXX-XXXXX" required keyboardType="phone-pad" half />
              </View>
              <TouchableOpacity style={styles.checkRow} onPress={() => setField('saveInfo')(!form.saveInfo)}>
                <View style={[styles.checkbox, form.saveInfo && styles.checkboxActive]}>
                  {form.saveInfo && <SymbolView name="checkmark" size={10} tintColor="#FFF" fallback={<Text style={{ color: '#FFF', fontSize: 9 }}>✓</Text>} />}
                </View>
                <Text style={styles.checkLabel}>Save this information for next time</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkRow} onPress={() => setField('emailOffers')(!form.emailOffers)}>
                <View style={[styles.checkbox, form.emailOffers && styles.checkboxActive]}>
                  {form.emailOffers && <SymbolView name="checkmark" size={10} tintColor="#FFF" fallback={<Text style={{ color: '#FFF', fontSize: 9 }}>✓</Text>} />}
                </View>
                <Text style={styles.checkLabel}>Message me with news and offers</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Price summary ────────────────────────────────────────── */}
          <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Sub Total ({items.length} {items.length === 1 ? 'item' : 'items'})</Text>
              <Text style={styles.priceValue}>{formatPrice(subtotal)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={styles.priceValueMuted}>−{formatPrice(discount)}</Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping</Text>
              <Text style={styles.priceValueMuted}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>

          {/* ── Policy links ─────────────────────────────────────────── */}
          <View style={styles.policyRow}>
            {POLICIES.map(p => (
              <TouchableOpacity key={p}>
                <Text style={styles.policyLink}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── Sticky CTA ───────────────────────────────────────────────── */}
        <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <TouchableOpacity
            style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
            onPress={handlePay}
            disabled={isProcessing || items.length === 0}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <View style={styles.payBtnInner}>
                <ActivityIndicator color="#FFF" size="small" />
                <Text style={styles.payBtnText}>{stepLabel[flowStep]}</Text>
              </View>
            ) : (
              <Text style={styles.payBtnText}>{stepLabel['idle']}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 0 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 24,
    borderBottomWidth: 1, borderBottomColor: '#DDDDDD',
    backgroundColor: '#FFFFFF', gap: 16,
  },
  backBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 20, color: '#000' },
  headerTitle: { flex: 1, fontFamily: Font.semibold, fontSize: 24, color: '#000', lineHeight: 24 },

  // Cart items
  section: { paddingHorizontal: 24, paddingTop: 24, gap: 8 },
  cartItem: { borderWidth: 1, borderColor: '#DDDDDD', paddingHorizontal: 16, paddingVertical: 16, gap: 24, backgroundColor: '#FFF' },
  cartItemTop: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  cartItemImage: { width: 114, height: 64, backgroundColor: '#F5F5F5', overflow: 'hidden' },
  cartItemInfo: { flex: 1, gap: 4, justifyContent: 'center' },
  cartItemName: { fontFamily: Font.medium, fontSize: FontSize.md, color: '#000', lineHeight: 22 },
  cartItemVariant: { fontFamily: Font.regular, fontSize: FontSize.base, color: '#626262', lineHeight: 20 },
  deleteBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  cartItemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyStepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDDDDD', paddingVertical: 4, paddingHorizontal: 8, gap: 4 },
  qtyBtn: { width: 26, height: 26, borderWidth: 1, borderColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontFamily: Font.regular, fontSize: 18, color: '#000', lineHeight: 22 },
  qtyTag: { width: 39, height: 23, backgroundColor: '#F5F5F5', borderRadius: 2, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontFamily: Font.medium, fontSize: FontSize.base, color: '#000' },
  cartItemPrice: { fontFamily: Font.regular, fontSize: 20, color: '#000', lineHeight: 20 },

  // Payment method
  paymentSection: { marginHorizontal: 24, marginTop: 8, borderWidth: 1, borderColor: '#DDDDDD', padding: 16, gap: 12 },
  paymentOptions: { gap: 12 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(221,221,221,0.5)', borderRadius: 4 },
  paymentOptionActive: { borderColor: '#000', backgroundColor: '#FAFAFA' },
  paymentOptionContent: { flex: 1 },
  paymentOptionTitle: { fontFamily: Font.medium, fontSize: FontSize.md, color: '#000', lineHeight: 20 },
  paymentOptionSub: { fontFamily: Font.regular, fontSize: FontSize.base, color: '#626262', lineHeight: 18 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#DDDDDD', backgroundColor: '#FFF' },
  radioActive: { borderColor: '#000', backgroundColor: '#000' },

  // Collapsible
  collapsibleSection: { borderWidth: 1, borderColor: '#DDDDDD', marginHorizontal: 24, marginTop: 8, backgroundColor: '#FFF' },
  collapsibleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  collapsibleTitle: { fontFamily: Font.medium, fontSize: 18, color: '#000', lineHeight: 18 },
  expandBtn: { width: 26, height: 26, borderWidth: 1, borderColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center' },
  expandIcon: { fontSize: 16, color: '#000', lineHeight: 20 },
  collapsibleBody: { paddingHorizontal: 16, paddingBottom: 16 },
  couponInputRow: { flexDirection: 'row', borderWidth: 1, borderColor: '#DDDDDD', overflow: 'hidden' },
  couponInput: { flex: 1, fontFamily: Font.regular, fontSize: FontSize.md, color: '#000', paddingHorizontal: 16, paddingVertical: 14 },
  couponApplyBtn: { width: 53, height: 53, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  noteInput: { borderWidth: 1, borderColor: '#DDDDDD', fontFamily: Font.regular, fontSize: FontSize.md, color: '#000', paddingHorizontal: 16, paddingVertical: 12, minHeight: 100 },

  // Address
  addressSection: { paddingHorizontal: 24, paddingTop: 24, gap: 24 },
  addressTitle: { fontFamily: Font.medium, fontSize: 24, color: '#000', lineHeight: 31.2 },
  formGrid: { gap: 16 },
  formRow: { flexDirection: 'row', gap: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  checkboxActive: { backgroundColor: '#000', borderColor: '#000' },
  checkLabel: { fontFamily: Font.regular, fontSize: FontSize.base, color: '#626262', lineHeight: 18 },

  // Price summary
  priceSummary: { borderWidth: 1, borderColor: '#DDDDDD', marginHorizontal: 24, marginTop: 24, padding: 16, gap: 16, backgroundColor: '#FFF' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontFamily: Font.medium, fontSize: 18, color: '#000', lineHeight: 18 },
  priceValue: { fontFamily: Font.medium, fontSize: FontSize.md, color: '#626262', lineHeight: 16 },
  priceValueMuted: { fontFamily: Font.medium, fontSize: FontSize.md, color: '#626262', lineHeight: 16 },
  totalRow: { borderTopWidth: 1, borderTopColor: '#DDDDDD', paddingTop: 16, marginTop: 0 },
  totalLabel: { fontFamily: Font.medium, fontSize: 18, color: '#000', lineHeight: 18 },
  totalValue: { fontFamily: Font.medium, fontSize: 20, color: '#000', lineHeight: 20 },

  // Policies
  policyRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  policyLink: { fontFamily: Font.regular, fontSize: FontSize.md, color: '#D4AF37', lineHeight: 16 },

  // CTA
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#DDDDDD', paddingTop: 16, paddingHorizontal: 32 },
  payBtn: { backgroundColor: '#000', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center' },
  payBtnDisabled: { opacity: 0.65 },
  payBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  payBtnText: { fontFamily: Font.semibold, fontSize: FontSize.md, color: '#FFFFFF', lineHeight: 21 },
});

import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatters';
import { Font, FontSize } from '@/theme/typography';

// ── Types ────────────────────────────────────────────────────────────────────

type CustomerState = 'none' | 'existing' | 'new';

// ── Mock address data ─────────────────────────────────────────────────────────

const MOCK_ADDRESSES = [
  {
    id: 0,
    title: 'Default Address',
    fullName: 'Rahul Sharma',
    line1: '42, MG Road, Bandra West,',
    line2: 'Mumbai, Maharashtra, India, 400050',
    phone: '+91 98765 43210',
  },
  {
    id: 1,
    title: 'Address 1',
    fullName: 'Rahul Sharma',
    line1: '7, Linking Road, Santacruz West,',
    line2: 'Mumbai, Maharashtra, India, 400054',
    phone: '+91 98765 43210',
  },
];

const POLICY_LINKS = [
  'Refund policy',
  'Shipping policy',
  'Privacy policy',
  'Terms of service',
  'Contact Us',
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function StaffCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { items, total } = useCart();

  const [customerState, setCustomerState] = useState<CustomerState>('none');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [showNote, setShowNote] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [note, setNote] = useState('');
  const [coupon, setCoupon] = useState('');

  // New customer form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSearch = () => {
    if (customerPhone.length >= 10) {
      setCustomerState('existing');
    } else {
      setCustomerState('new');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 50 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Cart Items Summary ───────────────────────────────────────────── */}
        <View style={styles.cartSection}>
          {items.map((item) => {
            const primaryImage = item.product.images.find((img) => img.isPrimary) ?? item.product.images[0];

            return (
              <View key={item.id} style={styles.cartItem}>
                {/* Thumbnail */}
                {primaryImage?.url ? (
                  <Image
                    source={{ uri: primaryImage.url }}
                    style={styles.thumbnail}
                    contentFit="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={['#2A2A2A', '#1A1A1A']}
                    style={styles.thumbnail}
                  />
                )}

                {/* Info */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemBrand}>{item.product.brand.name}</Text>
                  <Text style={styles.itemModel}>{item.product.name}</Text>
                </View>

                {/* Right: qty + price */}
                <View style={styles.itemRight}>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.totalPrice)}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Add Note ─────────────────────────────────────────────────────── */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={styles.toggleRowInner}
            onPress={() => setShowNote((v) => !v)}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleRowLabel}>Add Note</Text>
            <Text style={styles.toggleRowIcon}>{showNote ? '×' : '+'}</Text>
          </TouchableOpacity>
          {showNote && (
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note for this order…"
              placeholderTextColor="#626262"
              multiline
              textAlignVertical="top"
            />
          )}
        </View>

        {/* ── Discount ─────────────────────────────────────────────────────── */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={styles.toggleRowInner}
            onPress={() => setShowDiscount((v) => !v)}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleRowLabel}>Discount</Text>
            <Text style={styles.toggleRowIcon}>{showDiscount ? '×' : '+'}</Text>
          </TouchableOpacity>
          {showDiscount && (
            <View style={styles.couponRow}>
              <TextInput
                style={styles.couponInput}
                value={coupon}
                onChangeText={setCoupon}
                placeholder="Enter coupon code"
                placeholderTextColor="#626262"
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.couponSubmit} activeOpacity={0.8}>
                <Text style={styles.couponSubmitArrow}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Customer Details ─────────────────────────────────────────────── */}
        <View style={styles.customerSection}>
          <Text style={styles.customerHeading}>Enter customer details</Text>

          {/* Phone search */}
          <View style={styles.phoneRow}>
            <TextInput
              style={styles.phoneInput}
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="Enter customer phone number"
              placeholderTextColor="#626262"
              keyboardType="phone-pad"
              maxLength={15}
            />
            <TouchableOpacity onPress={handleSearch} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>

          {/* ── Existing customer: address cards ── */}
          {customerState === 'existing' && (
            <View style={styles.addressSection}>
              <Text style={styles.addressSubHeading}>Select customer details</Text>
              {MOCK_ADDRESSES.map((addr) => {
                const isSelected = selectedAddress === addr.id;
                return (
                  <TouchableOpacity
                    key={addr.id}
                    style={[
                      styles.addressCard,
                      isSelected && styles.addressCardSelected,
                    ]}
                    onPress={() => setSelectedAddress(addr.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.addressCardContent}>
                      <View style={styles.addressCardText}>
                        <Text style={styles.addressCardTitle}>{addr.title}</Text>
                        <Text style={styles.addressLine}>{addr.fullName}</Text>
                        <Text style={styles.addressLine}>{addr.line1}</Text>
                        <Text style={styles.addressLine}>{addr.line2}</Text>
                        <Text style={styles.addressLine}>{addr.phone}</Text>
                      </View>
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.checkboxInner} />}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ── New customer: form ── */}
          {customerState === 'new' && (
            <View style={styles.newCustomerForm}>
              <Text style={styles.addressSubHeading}>Add customer details</Text>

              {/* First Name */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>First Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor="#626262"
                />
              </View>

              {/* Last Name */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Last Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor="#626262"
                />
              </View>

              {/* Phone with country code */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Phone *</Text>
                <View style={styles.phoneFieldRow}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    style={[styles.formInput, styles.phoneFieldInput]}
                    value={newPhone}
                    onChangeText={setNewPhone}
                    placeholder="Phone number"
                    placeholderTextColor="#626262"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Address */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Address</Text>
                <TextInput
                  style={styles.formInput}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Address"
                  placeholderTextColor="#626262"
                />
              </View>

              {/* Apartment, suite */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Apartment, suite (optional)</Text>
                <TextInput
                  style={styles.formInput}
                  value={apartment}
                  onChangeText={setApartment}
                  placeholder="Apartment, suite, etc."
                  placeholderTextColor="#626262"
                />
              </View>

              {/* Country */}
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Country</Text>
                <View style={styles.selectWrapper}>
                  <TextInput
                    style={[styles.formInput, styles.selectInput]}
                    value={country}
                    onChangeText={setCountry}
                    placeholder="Country"
                    placeholderTextColor="#626262"
                  />
                  <Text style={styles.chevron}>›</Text>
                </View>
              </View>

              {/* City + State side by side */}
              <View style={styles.formRow}>
                <View style={[styles.formField, styles.formFieldHalf]}>
                  <Text style={styles.formLabel}>City</Text>
                  <TextInput
                    style={styles.formInput}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                    placeholderTextColor="#626262"
                  />
                </View>
                <View style={[styles.formField, styles.formFieldHalf]}>
                  <Text style={styles.formLabel}>State</Text>
                  <TextInput
                    style={styles.formInput}
                    value={state}
                    onChangeText={setState}
                    placeholder="State"
                    placeholderTextColor="#626262"
                  />
                </View>
              </View>

              {/* Zip code (half width) */}
              <View style={[styles.formField, styles.formFieldHalf]}>
                <Text style={styles.formLabel}>Zip code</Text>
                <TextInput
                  style={styles.formInput}
                  value={zipCode}
                  onChangeText={setZipCode}
                  placeholder="Zip code"
                  placeholderTextColor="#626262"
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}
        </View>

        {/* ── Policy Links ─────────────────────────────────────────────────── */}
        <View style={styles.policyRow}>
          {POLICY_LINKS.map((link) => (
            <TouchableOpacity key={link} activeOpacity={0.7}>
              <Text style={styles.policyLink}>{link}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacer for sticky CTA */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky Bottom CTA ────────────────────────────────────────────────── */}
      <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom + 16, 40) }]}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(staff)/checkout/success')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>
            {'PAY NOW  •  ' + formatPrice(total)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backArrow: {
    fontSize: 22,
    color: '#000000',
    lineHeight: 28,
  },
  headerTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    color: '#000000',
  },

  // ScrollView
  scrollContent: {
    paddingHorizontal: 40,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 32,
  },

  // ── Cart items ───────────────────────────────────────────────────────────
  cartSection: {
    gap: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
  },
  thumbnail: {
    width: 80,
    height: 48,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemBrand: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    color: '#000000',
  },
  itemModel: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: '#000000',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemQty: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#626262',
  },
  itemPrice: {
    fontFamily: Font.regular,
    fontSize: FontSize.xl,
    color: '#000000',
  },

  // ── Toggle rows (Note / Discount) ────────────────────────────────────────
  toggleRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
  },
  toggleRowInner: {
    height: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleRowLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: '#000000',
  },
  toggleRowIcon: {
    fontFamily: Font.medium,
    fontSize: 22,
    color: '#000000',
    lineHeight: 26,
  },
  noteInput: {
    height: 100,
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#000000',
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  couponInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#000000',
    backgroundColor: 'transparent',
  },
  couponSubmit: {
    width: 53,
    height: 53,
    backgroundColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponSubmitArrow: {
    fontFamily: Font.medium,
    fontSize: 22,
    color: '#FFFFFF',
    lineHeight: 26,
  },

  // ── Customer section ─────────────────────────────────────────────────────
  customerSection: {
    gap: 16,
  },
  customerHeading: {
    fontFamily: Font.medium,
    fontSize: FontSize['2xl'],
    color: '#000000',
  },
  phoneRow: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneInput: {
    flex: 1,
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#000000',
    padding: 0,
  },
  searchIcon: {
    fontSize: 20,
  },

  // ── Address cards ────────────────────────────────────────────────────────
  addressSection: {
    gap: 16,
  },
  addressSubHeading: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: '#000000',
  },
  addressCard: {
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    padding: 24,
  },
  addressCardSelected: {
    borderColor: '#D4AF37',
  },
  addressCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  addressCardText: {
    flex: 1,
    gap: 8,
  },
  addressCardTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#000000',
  },
  addressLine: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: '#000000',
    opacity: 0.8,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(221,221,221,0.87)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: '#D4AF37',
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4AF37',
  },

  // ── New customer form ────────────────────────────────────────────────────
  newCustomerForm: {
    opacity: 0.8,
    gap: 16,
  },
  formField: {
    gap: 6,
  },
  formLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    color: '#000000',
  },
  formInput: {
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#000000',
  },
  phoneFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCode: {
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  countryCodeText: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#000000',
  },
  phoneFieldInput: {
    flex: 1,
  },
  selectWrapper: {
    position: 'relative',
  },
  selectInput: {
    paddingRight: 36,
  },
  chevron: {
    position: 'absolute',
    right: 12,
    top: 0,
    height: 48,
    lineHeight: 48,
    fontSize: 22,
    color: '#626262',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formFieldHalf: {
    flex: 1,
  },

  // ── Policy links ─────────────────────────────────────────────────────────
  policyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  policyLink: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#D4AF37',
    textDecorationLine: 'underline',
  },

  // ── Sticky CTA ───────────────────────────────────────────────────────────
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(221,221,221,0.87)',
    paddingHorizontal: 40,
    paddingTop: 16,
  },
  ctaButton: {
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

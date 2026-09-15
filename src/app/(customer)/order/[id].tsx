import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';

function BackHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.backHeader, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <Text style={styles.backTitle}>{title}</Text>
      <View style={styles.backSpacer} />
    </View>
  );
}

function HorizontalDivider() {
  return <View style={styles.divider} />;
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rating, setRating] = useState(0);

  // Mock data based on id
  const isDelivered = id === '2';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BackHeader title="Orders Details" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Order summary */}
        <View style={styles.summaryRow}>
          <Image
            source={require('../../../../assets/images/cart-item-1.png')}
            style={styles.summaryImage}
            contentFit="cover"
          />
          <View style={styles.summaryInfo}>
            <Text style={styles.brandText}>GUCCI</Text>
            <Text style={styles.modelText}>
              {id === '2' ? 'GG145S-001' : 'GG1941S-001'}
            </Text>
            <Text style={styles.variantText}>Black / Gold</Text>
          </View>
        </View>

        {/* Order id row */}
        <View style={styles.orderIdRow}>
          <View style={styles.orderIdLeft}>
            <Text style={styles.orderIdText}>Order id: 78912539456</Text>
            <TouchableOpacity hitSlop={8}>
              <Text style={styles.copyIcon}>⎘</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {isDelivered ? 'Delivered' : 'Dispatched'}
            </Text>
          </View>
        </View>

        {/* Delivery info */}
        {isDelivered ? (
          <Text style={styles.deliveryText}>Order Delivered at 1 June, 2026</Text>
        ) : (
          <Text style={styles.deliveryText}>Estimate delivery 6 June, 2026</Text>
        )}

        {/* Check full status */}
        <TouchableOpacity hitSlop={4}>
          <Text style={styles.checkStatusLink}>Check full status</Text>
        </TouchableOpacity>

        {/* Return link */}
        {isDelivered && (
          <TouchableOpacity hitSlop={4}>
            <Text style={styles.returnLink}>Don&apos;t like the product? Return</Text>
          </TouchableOpacity>
        )}

        {/* Rate experience */}
        <View style={styles.rateSection}>
          <Text style={styles.rateSectionTitle}>Rate your experience:</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} hitSlop={4}>
                <Text style={[styles.starIcon, star <= rating && styles.starIconActive]}>
                  {star <= rating ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <HorizontalDivider />

        {/* Delivery address */}
        <Text style={styles.sectionHeading}>Delivery Address</Text>
        <View style={styles.addressBlock}>
          <Text style={styles.addressText}>Full Name</Text>
          <Text style={styles.addressText}>123 Luxury Lane, Apt 4B</Text>
          <Text style={styles.addressText}>Mumbai, Maharashtra, India - 400001</Text>
          <Text style={styles.addressText}>+91 98765-43210</Text>
        </View>

        <HorizontalDivider />

        {/* Price details */}
        <Text style={styles.sectionHeading}>Price Details</Text>
        <View style={styles.priceRows}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabelText}>Sub Total</Text>
            <Text style={styles.priceValueText}>₹42,000</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabelText}>Shipping</Text>
            <Text style={styles.priceValueText}>₹200</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹42,200</Text>
          </View>
        </View>

        {/* Download invoice button */}
        <TouchableOpacity style={styles.invoiceBtn} activeOpacity={0.85}>
          <Text style={styles.invoiceBtnText}>Download invoice</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Back header
  backHeader: {
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backArrow: {
    fontSize: 22,
    color: '#000000',
  },
  backTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  backSpacer: {
    width: 38,
  },

  content: {
    padding: 24,
    gap: 16,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  summaryImage: {
    width: 148,
    height: 71,
    borderRadius: 4,
  },
  summaryInfo: {
    flex: 1,
    gap: 4,
  },
  brandText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    color: '#000000',
  },
  modelText: {
    fontFamily: Font.regular,
    fontSize: FontSize['2xl'],
    color: '#000000',
    lineHeight: FontSize['2xl'] * 1.3,
  },
  variantText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    color: '#626262',
  },

  // Order id
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderIdLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderIdText: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: '#000000',
  },
  copyIcon: {
    fontSize: 18,
    color: '#626262',
  },
  statusBadge: {
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: Font.regular,
    fontSize: FontSize.sm,
    color: '#626262',
  },

  // Delivery
  deliveryText: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: '#000000',
    lineHeight: FontSize.lg * 1.3,
  },
  checkStatusLink: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: '#D4AF37',
    textDecorationLine: 'underline',
  },
  returnLink: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: '#626262',
    textDecorationLine: 'underline',
  },

  // Rating
  rateSection: {
    gap: 12,
  },
  rateSectionTitle: {
    fontFamily: Font.medium,
    fontSize: FontSize.lg,
    color: '#000000',
    lineHeight: FontSize.lg * 1.3,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  starIcon: {
    fontSize: 24,
    color: '#626262',
    width: 24,
    textAlign: 'center',
  },
  starIconActive: {
    color: '#D4AF37',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(221,221,221,0.87)',
    marginVertical: 4,
  },

  // Sections
  sectionHeading: {
    fontFamily: Font.medium,
    fontSize: FontSize.xl,
    color: '#000000',
  },

  // Address
  addressBlock: {
    gap: 4,
  },
  addressText: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: '#626262',
    lineHeight: FontSize.base * 1.5,
  },

  // Price
  priceRows: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabelText: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: '#626262',
  },
  priceValueText: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: '#000000',
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(221,221,221,0.87)',
  },
  totalLabel: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#000000',
  },
  totalValue: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#000000',
  },

  // Invoice button
  invoiceBtn: {
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  invoiceBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

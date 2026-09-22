import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { STAFF_HOME } from '@/constants/routes';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/common/Text';
import { Font, FontSize } from '@/theme/typography';

export default function StaffOrderSuccessScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 50 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Booked</Text>
      </View>

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      >
        {/* ── Order item row ─────────────────────────────────────────────────── */}
        <View style={styles.orderRow}>
          <LinearGradient colors={['#2A2A2A', '#1A1A1A']} style={styles.productImage} />
          <View style={styles.orderInfo}>
            <Text style={styles.brand}>GUCCI</Text>
            <Text style={styles.model}>GG145S-001</Text>
            <Text style={styles.variant}>Golden 50B, 54</Text>
            <View style={styles.orderIdRow}>
              <Text style={styles.orderIdLabel}>Order id: </Text>
              <Text style={styles.orderIdValue}>78912539456</Text>
              <TouchableOpacity hitSlop={8}>
                <Text style={styles.copyIcon}>⎘</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Delivery Address card ──────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Address</Text>
          <View style={styles.divider} />
          <Text style={styles.addressLine}>Full name</Text>
          <Text style={styles.addressLine}>
            Address, City, State, Country, Zip code, Phone number
          </Text>
        </View>

        {/* ── Price Details card ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Details</Text>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Sub Total (1 item)</Text>
            <Text style={styles.priceLabel}>Rs. 29,800.00</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalLabel}>Rs. 30,000.00</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom sticky bar ─────────────────────────────────────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: 40 + insets.bottom }]}>
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={() => router.replace(STAFF_HOME)}
        >
          <Text style={styles.continueButtonText}>CONTINUE SHOPPING</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: '#000000',
  },
  headerTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    color: '#000000',
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 32,
    paddingHorizontal: 40,
    gap: 24,
  },

  // Order item row
  orderRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  productImage: {
    width: 148,
    height: 72,
    borderRadius: 4,
  },
  orderInfo: {
    flex: 1,
    gap: 8,
  },
  brand: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    color: '#000000',
  },
  model: {
    fontFamily: Font.regular,
    fontSize: FontSize['2xl'],
    color: '#000000',
  },
  variant: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#626262',
  },
  orderIdRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  orderIdLabel: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#000000',
  },
  orderIdValue: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.6,
    color: '#000000',
  },
  copyIcon: {
    fontSize: 20,
    color: '#626262',
  },

  // Card
  card: {
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    padding: 24,
    gap: 12,
  },
  cardTitle: {
    fontFamily: Font.medium,
    fontSize: FontSize.xl,
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(221,221,221,0.87)',
  },
  addressLine: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: '#000000',
    opacity: 0.8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#626262',
  },
  totalLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.xl,
    color: '#000000',
  },

  // Bottom bar
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(221,221,221,0.87)',
    paddingTop: 16,
    paddingHorizontal: 40,
  },
  continueButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
  },
});

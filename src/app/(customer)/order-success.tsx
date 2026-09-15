import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import { Text } from '@/components/common/Text';
import { Font, FontSize } from '@/theme/typography';
import { formatPrice } from '@/utils/formatters';

export default function OrderSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { orderId, orderNumber, total, method } = useLocalSearchParams<{
    orderId: string;
    orderNumber: string;
    total: string;
    method: string;
  }>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
    ]).start();
  }, []);

  const isCOD = method === 'COD';
  const totalFormatted = total ? formatPrice(parseFloat(total)) : '';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Animated checkmark */}
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.checkMark}>✓</Text>
        </Animated.View>

        <Animated.View style={[styles.textBlock, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.subtitle}>
            {isCOD
              ? 'Your order has been placed successfully. Pay when it arrives.'
              : 'Payment successful. Your order is confirmed.'}
          </Text>

          {/* Order details */}
          <View style={styles.detailsCard}>
            {orderNumber ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order No.</Text>
                <Text style={styles.detailValue}>{orderNumber}</Text>
              </View>
            ) : null}
            {totalFormatted ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={styles.detailValue}>{totalFormatted}</Text>
              </View>
            ) : null}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment</Text>
              <Text style={styles.detailValue}>{isCOD ? 'Cash on Delivery' : 'Razorpay'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{isCOD ? 'PROCESSING' : 'PAID'}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* CTAs */}
      <Animated.View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, 24), opacity: fadeAnim }]}>
        {orderId ? (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.replace({ pathname: '/(customer)/order/[id]', params: { id: orderId } })}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Track Order</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace('/(customer)')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 32 },

  checkCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#000', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
  },
  checkMark: { fontSize: 44, color: '#D4AF37', lineHeight: 52 },

  textBlock: { alignItems: 'center', gap: 12, width: '100%' },
  title: { fontFamily: Font.semibold, fontSize: 28, color: '#000', lineHeight: 36, textAlign: 'center' },
  subtitle: { fontFamily: Font.regular, fontSize: FontSize.base, color: '#626262', lineHeight: 22, textAlign: 'center' },

  detailsCard: {
    width: '100%', borderWidth: 1, borderColor: '#DDDDDD',
    padding: 20, marginTop: 8, gap: 16,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontFamily: Font.regular, fontSize: FontSize.base, color: '#626262', lineHeight: 20 },
  detailValue: { fontFamily: Font.medium, fontSize: FontSize.md, color: '#000', lineHeight: 20 },

  statusBadge: {
    backgroundColor: '#000', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4,
  },
  statusText: { fontFamily: Font.semibold, fontSize: 11, color: '#D4AF37', letterSpacing: 0.5 },

  ctaBar: { paddingHorizontal: 32, paddingTop: 16, gap: 12, borderTopWidth: 1, borderTopColor: '#DDDDDD' },
  primaryBtn: { backgroundColor: '#000', borderRadius: 8, paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { fontFamily: Font.semibold, fontSize: FontSize.md, color: '#FFF', lineHeight: 21 },
  secondaryBtn: { borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 8, paddingVertical: 16, alignItems: 'center' },
  secondaryBtnText: { fontFamily: Font.semibold, fontSize: FontSize.md, color: '#000', lineHeight: 21 },
});

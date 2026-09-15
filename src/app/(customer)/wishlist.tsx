import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';
import { ProductCard } from '@/components/product/ProductCard';
import { useAppSelector } from '@/store';

function BackHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.backHeader,
        { paddingTop: insets.top + 8 },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <Text style={styles.backTitle}>{title}</Text>
      <View style={styles.backSpacer} />
    </View>
  );
}

export default function WishlistScreen() {
  const wishlist = useAppSelector(state => state.wishlist?.items ?? []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <BackHeader title="Wishlist" />

      {wishlist.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptyDesc}>
            Save items you love and come back to them later.
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(customer)/explore')}
            activeOpacity={0.85}
          >
            <Text style={styles.shopBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} size="large" />
            ))}
          </View>
        </ScrollView>
      )}
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

  // Grid
  grid: {
    padding: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  // Empty state
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    color: Colors.textGray,
  },
  emptyTitle: {
    fontFamily: Font.medium,
    fontSize: FontSize.xl,
    color: '#000000',
  },
  emptyDesc: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: '#626262',
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
  },
  shopBtn: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
  },
  shopBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

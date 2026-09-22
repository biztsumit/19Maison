import { useLatestDrop, useCollectorsEditionDrop } from '@/hooks/useHomepage';
import { Thumbnail } from '@/components/customer/ui/Thumbnail';
import { HomepageProductItem } from '@/types/homepage.types';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '@/components/common/Text';
import { Font, FontSize } from '@/theme/typography';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// ── Static brand data ─────────────────────────────────────────────────────────

const BRANDS = [
  { name: 'Gucci', image: require('../../../../assets/images/brand-gucci.png') },
  { name: 'Leimann', image: require('../../../../assets/images/brand-leimann.png') },
  { name: 'Dior', image: require('../../../../assets/images/brand-dior.png') },
  { name: 'Fendi', image: require('../../../../assets/images/brand-fendi.png') },
  { name: 'Givenchy', image: require('../../../../assets/images/brand-givenchy.png') },
  { name: 'Dunhill', image: require('../../../../assets/images/brand-dunhill.png') },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(item: HomepageProductItem): string {
  const discounted = item.discountedPrice ?? 0;
  const amount = discounted > 0 ? discounted : item.price;
  return `₹ ${(amount ?? 0).toFixed(2)}`;
}

function getSku(item: HomepageProductItem): string {
  return (item.modelNumber ?? item.name ?? '').slice(0, 12);
}

// ── Product card skeleton ─────────────────────────────────────────────────────

function ProductCardSkeleton({ width = 190 }: { width?: number }) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.cardImageArea}>
        <Skeleton height={170} width={width - 2} />
      </View>
      <View style={styles.cardInfo}>
        <Skeleton height={10} width="60%" />
        <Skeleton height={12} width="40%" />
      </View>
    </View>
  );
}

// ── Real product card ─────────────────────────────────────────────────────────

function ProductCard({ item, width = 190 }: { item: HomepageProductItem; width?: number }) {
  const imageUrl = item.images.length > 0 ? item.images[0].imageUrl : null;

  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      activeOpacity={0.85}
      onPress={() => router.push(`/(staff)/product/${item.id}`)}
    >
      <View style={styles.cardImageArea}>
        {imageUrl !== null ? (
          <Thumbnail uri={imageUrl} tone="dark" style={styles.cardImage} contentFit="cover" />
        ) : (
          <LinearGradient colors={['#2A2A2A', '#1A1A1A']} style={styles.cardImage} />
        )}
        <View style={styles.cardBagChip}>
          <Text style={styles.cardBagIcon}>🛍</Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardSku} numberOfLines={1}>
          {getSku(item)}
        </Text>
        <Text style={styles.cardPrice}>{formatPrice(item)}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Section heading row ───────────────────────────────────────────────────────

function SectionHeading({
  title,
  titleSize = 30,
  viewMoreSize = 16,
}: {
  title: string;
  titleSize?: number;
  viewMoreSize?: number;
}) {
  return (
    <View style={styles.sectionHeadingRow}>
      <Text
        style={[styles.sectionHeadingText, { fontSize: titleSize, lineHeight: titleSize * 1.3 }]}
      >
        {title}
      </Text>
      <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(staff)/(tabs)/category')}>
        <Text style={[styles.viewMore, { fontSize: viewMoreSize }]}>View more</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Product horizontal list ───────────────────────────────────────────────────

function ProductRow({
  items,
  isLoading,
  cardWidth = 190,
}: {
  items: HomepageProductItem[] | undefined;
  isLoading: boolean;
  cardWidth?: number;
}) {
  const skeletons: null[] = Array(4).fill(null);

  return (
    <FlatList
      data={isLoading ? skeletons : (items ?? [])}
      keyExtractor={(_, i) => String(i)}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12 }}
      renderItem={({ item }) =>
        isLoading || item === null ? (
          <ProductCardSkeleton width={cardWidth} />
        ) : (
          <ProductCard item={item as HomepageProductItem} width={cardWidth} />
        )
      }
    />
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function StaffHomeScreen() {
  const insets = useSafeAreaInsets();

  const { data: latestDrop, isLoading: latestLoading } = useLatestDrop();
  const { data: collectors, isLoading: collectorsLoading } = useCollectorsEditionDrop();

  const bestSellers = latestDrop != null ? latestDrop.slice(0, 8) : undefined;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 50) }]}>
          <Image
            source={require('../../../../assets/images/appLogo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#626262"
            />
          </View>
        </View>

        {/* ── Brand circles ──────────────────────────────────────────────────── */}
        <View style={styles.brandsRow}>
          <FlatList
            data={BRANDS}
            keyExtractor={b => b.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 24 }}
            renderItem={({ item }) => (
              <View style={styles.brandItem}>
                <Image source={item.image} style={styles.brandCircle} contentFit="cover" />
                <Text style={styles.brandName}>{item.name}</Text>
              </View>
            )}
          />
        </View>

        {/* ── Latest Drop ────────────────────────────────────────────────────── */}
        <View style={styles.productSection}>
          <SectionHeading title="Latest drop" titleSize={30} viewMoreSize={16} />
          <ProductRow items={latestDrop} isLoading={latestLoading} cardWidth={190} />
        </View>

        {/* ── Collectors Edition ─────────────────────────────────────────────── */}
        <View style={styles.productSection}>
          <SectionHeading title="Collectors edition" titleSize={30} viewMoreSize={16} />
          <ProductRow items={collectors} isLoading={collectorsLoading} cardWidth={190} />
        </View>

        {/* ── Best Sellers ───────────────────────────────────────────────────── */}
        <View style={styles.bestSellersSection}>
          <SectionHeading title="Best Sellers" titleSize={22} viewMoreSize={12} />
          <ProductRow items={bestSellers} isLoading={latestLoading} cardWidth={182} />
        </View>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
          <Text style={styles.footerText}>© 2026 19 Maison eyewear, ALL right reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Header
  header: {
    backgroundColor: '#000000',
    paddingHorizontal: 40,
    paddingBottom: 24,
    gap: 24,
  },
  logo: {
    width: 210,
    height: 44,
    alignSelf: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  searchIcon: {
    fontSize: 22,
    lineHeight: 26,
  },
  searchInput: {
    flex: 1,
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    color: '#000000',
    padding: 0,
  },

  // Brands row
  brandsRow: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  brandItem: {
    alignItems: 'center',
    gap: 8,
  },
  brandCircle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(98,98,98,0.87)',
  },
  brandName: {
    fontFamily: Font.bold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
  },

  // Product sections
  productSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 40,
    gap: 16,
  },
  bestSellersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 32,
    gap: 16,
  },

  // Section heading
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeadingText: {
    fontFamily: Font.semibold,
    color: '#000000',
  },
  viewMore: {
    fontFamily: Font.semibold,
    color: '#D4AF37',
    textDecorationLine: 'underline',
  },

  // Product card
  card: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
  },
  cardImageArea: {
    height: 170,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBagChip: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBagIcon: {
    fontSize: 14,
    lineHeight: 16,
  },
  cardInfo: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
  },
  cardSku: {
    fontFamily: Font.bold,
    fontSize: FontSize.base,
    color: '#626262',
  },
  cardPrice: {
    fontFamily: Font.bold,
    fontSize: FontSize.md,
    color: '#000000',
  },

  // Footer
  footer: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: Font.light,
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});

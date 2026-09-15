import { Text } from '@/components/common/Text';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { useCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProducts';
import { useAppSelector } from '@/store';
import { selectCartItemCount } from '@/store/selectors/cart.selectors';
import { Font, FontSize } from '@/theme/typography';
import type { ProductImage, ProductVariant } from '@/types/product.types';
import { formatPrice } from '@/utils/formatters';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useRef, useState } from 'react';
import {
  Clipboard,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// ── Static content ─────────────────────────────────────────────────────────

const COUPON_CODE = 'FLAT10';

const FEATURES = [
  { title: 'Fast Shipping', subtitle: 'Ships in 48–72 Hrs' },
  { title: 'Secure Payment', subtitle: '100% Safe Checkout' },
  { title: '7-Day Exchange', subtitle: 'View Policy' },
] as const;

const ACCORDION_SECTIONS = [
  'Description',
  'Authenticity & Warranty Information',
  'Product Care',
  'Shipping & Returns Policy',
  'After-Sales Service',
] as const;

// ── Helpers ────────────────────────────────────────────────────────────────

function uniqueColors(variants: ProductVariant[]) {
  const seen = new Set<string>();
  return variants.filter(v => {
    if (seen.has(v.frameColor)) return false;
    seen.add(v.frameColor);
    return true;
  });
}

function uniqueSizes(variants: ProductVariant[], color?: string) {
  const filtered = color ? variants.filter(v => v.frameColor === color) : variants;
  const seen = new Set<number>();
  return filtered.filter(v => {
    if (v.size == null || seen.has(v.size)) return false;
    seen.add(v.size);
    return true;
  });
}

// ── Screen ─────────────────────────────────────────────────────────────────

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const { addToCart, isAuthenticated } = useCart();
  const cartCount = useAppSelector(selectCartItemCount);

  const flatListRef = useRef<FlatList>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Description']));
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  // Derive selected variant
  const activeColor = selectedColor ?? product?.variants[0]?.frameColor ?? null;
  const activeSizes = product ? uniqueSizes(product.variants, activeColor ?? undefined) : [];
  const activeSize = selectedSize ?? activeSizes[0]?.size ?? null;

  const selectedVariant: ProductVariant | undefined =
    product?.variants.find(
      v => v.frameColor === activeColor && (activeSize == null || v.size === activeSize),
    ) ?? product?.variants[0];

  // Images: prefer variant images if available, fall back to product images
  const displayImages: ProductImage[] =
    (selectedVariant?.images?.length ? selectedVariant.images : product?.images) ?? [];

  const colorVariants = product ? uniqueColors(product.variants) : [];

  // Navigate to image index when thumbnail tapped
  const selectThumbnail = useCallback((index: number) => {
    setActiveImageIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);
  const toggleSection = (name: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleAddToCart = async (navigateAfter = false) => {
    if (!selectedVariant) return;
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    const setter = navigateAfter ? setBuying : setAdding;
    setter(true);
    try {
      await addToCart({ variantId: selectedVariant.id, quantity: 1 });
      if (navigateAfter) {
        router.push('/(customer)/checkout');
      } else {
        Toast.show({ type: 'success', text1: 'Added to bag' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to add to bag' });
    } finally {
      setter(false);
    }
  };

  const copyCoupon = () => {
    Clipboard.setString(COUPON_CODE);
    Toast.show({ type: 'success', text1: `Code "${COUPON_CODE}" copied` });
  };

  // ── Loading skeleton ───────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <SymbolView
              name="chevron.left"
              size={22}
              tintColor="#000"
              fallback={<Text style={styles.backIcon}>←</Text>}
            />
          </TouchableOpacity>
        </View>
        <Skeleton height={300} />
        <View style={{ padding: 24, gap: 12 }}>
          <Skeleton height={12} width="40%" />
          <Skeleton height={20} width="70%" />
          <Skeleton height={24} width="35%" />
          <Skeleton height={48} />
          <Skeleton height={48} />
        </View>
      </View>
    );
  }

  if (isError) {
    const errMsg =
      (error as any)?.response?.data?.message ?? (error as any)?.message ?? 'Unknown error';
    const errStatus = (error as any)?.response?.status;
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <SymbolView
              name="chevron.left"
              size={22}
              tintColor="#000"
              fallback={<Text style={styles.backIcon}>←</Text>}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 }}
        >
          <Text
            style={{
              fontFamily: Font.semibold,
              fontSize: FontSize.md,
              color: '#000',
              textAlign: 'center',
            }}
          >
            Could not load product
          </Text>
          <Text
            style={{
              fontFamily: Font.regular,
              fontSize: FontSize.base,
              color: '#626262',
              textAlign: 'center',
            }}
          >
            {errStatus ? `HTTP ${errStatus}: ` : ''}
            {errMsg}
          </Text>
          <Text
            style={{ fontFamily: Font.regular, fontSize: 11, color: '#999', textAlign: 'center' }}
          >
            ID: {id}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginTop: 12,
              paddingHorizontal: 24,
              paddingVertical: 12,
              backgroundColor: '#000',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontFamily: Font.semibold, fontSize: FontSize.base, color: '#FFF' }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!product) return null;

  const price = selectedVariant?.discountedPrice ?? selectedVariant?.salePrice ?? product.price;
  const originalPrice =
    selectedVariant?.discountedPrice != null &&
    selectedVariant.discountedPrice < selectedVariant.salePrice
      ? selectedVariant.salePrice
      : null;
  const discountPct = selectedVariant?.discountPercentage ?? 0;
  const inStock = selectedVariant?.inStock !== false;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <SymbolView
            name="chevron.left"
            size={22}
            tintColor="#000"
            fallback={<Text style={styles.backIcon}>←</Text>}
          />
        </TouchableOpacity>

        <View style={styles.headerSearch}>
          <SymbolView
            name="magnifyingglass"
            size={16}
            tintColor="#626262"
            fallback={<Text style={styles.searchIcon}>🔍</Text>}
          />
          <TextInput
            style={styles.headerSearchInput}
            placeholder="Search"
            placeholderTextColor="#626262"
            editable={false}
          />
        </View>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push('/(customer)/cart')}
          hitSlop={8}
        >
          <SymbolView
            name="bag"
            size={22}
            tintColor="#000"
            fallback={<Text style={styles.backIcon}>🛒</Text>}
          />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : String(cartCount)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Hero image carousel ──────────────────────────────────────── */}
        <View style={[styles.heroWrap, { width: screenWidth, height: 300 }]}>
          {displayImages.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={displayImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              onMomentumScrollEnd={e => {
                const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                setActiveImageIndex(index);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.url }}
                  style={{ width: screenWidth, height: 300 }}
                  contentFit="cover"
                />
              )}
            />
          ) : (
            <LinearGradient colors={['#1A1A1A', '#2A2A2A']} style={{ flex: 1 }} />
          )}

          {/* Rating badge — absolute top-left */}
          {(product.rating != null || product.reviewCount != null) && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingValue}>{(product.rating ?? 0).toFixed(1)}</Text>
              {product.reviewCount != null && (
                <Text style={styles.ratingCount}>({product.reviewCount})</Text>
              )}
            </View>
          )}

          {/* Wishlist heart — absolute top-right */}
          <TouchableOpacity style={styles.wishlistBtn} hitSlop={8}>
            <SymbolView
              name="heart"
              size={20}
              tintColor="#000"
              fallback={<Text style={{ fontSize: 18 }}>♡</Text>}
            />
          </TouchableOpacity>

          {/* Dot indicators — absolute bottom-center */}
          {displayImages.length > 1 && (
            <View style={styles.dotsRow}>
              {displayImages.map((_, i) => (
                <View key={i} style={i === activeImageIndex ? styles.dotActive : styles.dot} />
              ))}
            </View>
          )}
        </View>

        {/* ── Thumbnails ───────────────────────────────────────────────── */}
        {displayImages.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbsScroll}
            style={styles.thumbsContainer}
          >
            {displayImages.map((img, i) => (
              <TouchableOpacity
                key={img.id}
                style={[
                  styles.thumb,
                  i === activeImageIndex ? styles.thumbActive : styles.thumbInactive,
                ]}
                onPress={() => selectThumbnail(i)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: img.url }} style={styles.thumbImage} contentFit="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Product info ─────────────────────────────────────────────── */}
        <View style={styles.infoSection}>
          {/* Brand */}
          <Text style={styles.brandName}>{product.brand.name.toUpperCase()}</Text>

          {/* Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(price)}</Text>
            {originalPrice != null && (
              <Text style={styles.originalPrice}>{formatPrice(originalPrice)}</Text>
            )}
            {discountPct > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>{discountPct}% OFF</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Color selector ───────────────────────────────────────────── */}
        {colorVariants.length > 0 && (
          <View style={styles.selectorSection}>
            <Text style={styles.selectorLabel}>
              Colors: <Text style={styles.selectorValue}>{activeColor ?? ''}</Text>
            </Text>
            <View style={styles.swatchRow}>
              {colorVariants.map(v => (
                <TouchableOpacity
                  key={v.id}
                  style={[
                    styles.swatch,
                    activeColor === v.frameColor ? styles.swatchActive : styles.swatchInactive,
                  ]}
                  onPress={() => {
                    setSelectedColor(v.frameColor);
                    setSelectedSize(null);
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[styles.swatchInner, { backgroundColor: v.frameColorCode ?? '#888888' }]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Size selector ────────────────────────────────────────────── */}
        {activeSizes.length > 0 && (
          <View style={styles.selectorSection}>
            <Text style={styles.selectorLabel}>
              Size: <Text style={styles.selectorValue}>{activeSize ?? ''}</Text>
            </Text>
            <View style={styles.sizeRow}>
              {activeSizes.map(v => {
                const isActive = activeSize === v.size;
                const oos = !v.inStock;
                return (
                  <TouchableOpacity
                    key={v.id}
                    style={[
                      styles.sizeBtn,
                      isActive ? styles.sizeBtnActive : styles.sizeBtnInactive,
                      oos && styles.sizeBtnOos,
                    ]}
                    onPress={() => !oos && setSelectedSize(v.size ?? null)}
                    disabled={oos}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.sizeBtnText, isActive && styles.sizeBtnTextActive]}>
                      {v.size}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Coupon banner ────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.couponBanner} onPress={copyCoupon} activeOpacity={0.85}>
          <SymbolView
            name="doc.on.doc"
            size={16}
            tintColor="#000"
            fallback={<Text style={{ fontSize: 14 }}>📋</Text>}
          />
          <Text style={styles.couponText}>
            Use code <Text style={styles.couponCode}>{COUPON_CODE}</Text> for 10% off your order
          </Text>
        </TouchableOpacity>

        {/* ── Feature chips ────────────────────────────────────────────── */}
        <View style={styles.featuresRow}>
          {FEATURES.map(f => (
            <View key={f.title} style={styles.featureChip}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
            </View>
          ))}
        </View>

        {/* ── Accordion sections ──────────────────────────────────────── */}
        <View style={styles.accordion}>
          {ACCORDION_SECTIONS.map(section => {
            const isOpen = openSections.has(section);
            return (
              <View key={section} style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleSection(section)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.accordionTitle}>{section}</Text>
                  <SymbolView
                    name={isOpen ? 'minus' : 'plus'}
                    size={16}
                    tintColor="#000"
                    fallback={<Text style={styles.accordionIcon}>{isOpen ? '−' : '+'}</Text>}
                  />
                </TouchableOpacity>
                {isOpen && (
                  <Text style={styles.accordionBody}>
                    {section === 'Description'
                      ? (product.description ??
                        'Premium luxury eyewear crafted with the finest materials. Each piece reflects meticulous attention to detail and timeless design.')
                      : section === 'Authenticity & Warranty Information'
                        ? 'All products are sourced directly from official brand distributors and come with a manufacturer warranty. Certificate of authenticity included.'
                        : section === 'Product Care'
                          ? 'Clean lenses with the included microfiber cloth. Store in the provided case when not in use. Avoid prolonged exposure to heat or moisture.'
                          : section === 'Shipping & Returns Policy'
                            ? 'Free shipping across India with tracked delivery. Returns and exchanges accepted within 7 days of delivery in original condition.'
                            : 'Free frame adjustments and repairs at any of our flagship stores. Our dedicated service team is available Monday–Saturday, 10am–7pm.'}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Extra bottom padding for sticky CTA */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky bottom CTA ────────────────────────────────────────────── */}
      <View style={[styles.stickyBottom, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[
            styles.ctaBtn,
            styles.ctaBtnOutline,
            (!inStock || adding) && styles.ctaBtnDisabled,
          ]}
          onPress={() => handleAddToCart(false)}
          disabled={!inStock || adding}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnOutlineText}>
            {adding ? 'ADDING…' : !inStock ? 'OUT OF STOCK' : 'ADD TO CART'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.ctaBtn, styles.ctaBtnSolid, (!inStock || buying) && styles.ctaBtnDisabled]}
          onPress={() => handleAddToCart(true)}
          disabled={!inStock || buying}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnSolidText}>{buying ? 'PLEASE WAIT…' : 'BUY NOW'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 0 },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  headerRow: {},
  backBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 20, color: '#000' },
  headerSearch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  headerSearchInput: {
    flex: 1,
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    color: '#000',
    padding: 0,
  },
  cartBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: { fontFamily: Font.bold, fontSize: 9, color: '#FFF' },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroWrap: { position: 'relative', overflow: 'hidden' },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingStar: { fontSize: 12, color: '#D4AF37' },
  ratingValue: { fontFamily: Font.semibold, fontSize: FontSize.sm, color: '#000' },
  ratingCount: { fontFamily: Font.regular, fontSize: FontSize.sm, color: '#000' },
  wishlistBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 1000,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F9F9F9' },
  dotActive: { width: 24, height: 6, borderRadius: 3, backgroundColor: '#D4AF37' },

  // ── Thumbnails ────────────────────────────────────────────────────────────
  thumbsContainer: { backgroundColor: '#FFFFFF' },
  thumbsScroll: { paddingHorizontal: 24, paddingVertical: 12, gap: 8 },
  thumb: { width: 71, height: 40, borderRadius: 4, overflow: 'hidden' },
  thumbActive: { borderWidth: 2, borderColor: '#D4AF37' },
  thumbInactive: { borderWidth: 1, borderColor: 'rgba(221,221,221,0.87)' },
  thumbImage: { width: '100%', height: '100%' },

  // ── Product info ──────────────────────────────────────────────────────────
  infoSection: { paddingHorizontal: 24, paddingTop: 20, gap: 8 },
  brandName: {
    fontFamily: Font.bold,
    fontSize: 12,
    color: '#000',
    letterSpacing: 1.5,
  },
  productName: {
    fontFamily: Font.regular,
    fontSize: 20,
    color: '#000',
    lineHeight: 28,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  price: { fontFamily: Font.semibold, fontSize: 24, color: '#000', lineHeight: 32 },
  originalPrice: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    color: '#626262',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#000',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountBadgeText: { fontFamily: Font.semibold, fontSize: 11, color: '#D4AF37' },

  // ── Selectors ─────────────────────────────────────────────────────────────
  selectorSection: { paddingHorizontal: 24, paddingTop: 20, gap: 10 },
  selectorLabel: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#000',
    lineHeight: 22,
  },
  selectorValue: { fontFamily: Font.regular, fontSize: FontSize.md, color: '#626262' },

  swatchRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  swatch: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  swatchActive: { borderWidth: 2, borderColor: '#D4AF37' },
  swatchInactive: { borderWidth: 1, borderColor: 'rgba(221,221,221,0.87)' },
  swatchInner: { flex: 1, width: '100%' },

  sizeRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  sizeBtn: {
    width: 50,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtnActive: { borderWidth: 2, borderColor: '#D4AF37' },
  sizeBtnInactive: { borderWidth: 1, borderColor: 'rgba(221,221,221,0.87)' },
  sizeBtnOos: { opacity: 0.35 },
  sizeBtnText: { fontFamily: Font.regular, fontSize: FontSize.md, color: '#000' },
  sizeBtnTextActive: { fontFamily: Font.semibold, color: '#D4AF37' },

  // ── Coupon banner ─────────────────────────────────────────────────────────
  couponBanner: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: '#D4AF37',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  couponText: {
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    color: '#000',
    lineHeight: 22,
    flex: 1,
  },
  couponCode: { fontFamily: Font.semibold, fontSize: FontSize.sm, color: '#000' },

  // ── Feature chips ─────────────────────────────────────────────────────────
  featuresRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    gap: 8,
  },
  featureChip: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  featureTitle: {
    fontFamily: Font.semibold,
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    lineHeight: 16,
  },
  featureSubtitle: {
    fontFamily: Font.regular,
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
    lineHeight: 14,
  },

  // ── Accordion ─────────────────────────────────────────────────────────────
  accordion: { marginTop: 20 },
  accordionItem: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(221,221,221,0.87)',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  accordionTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#000',
    lineHeight: FontSize.md * 1.6,
    flex: 1,
  },
  accordionIcon: { fontSize: 18, color: '#000', lineHeight: 22 },
  accordionBody: {
    fontFamily: Font.light,
    fontSize: FontSize.sm,
    color: '#626262',
    lineHeight: FontSize.sm * 1.6,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  // ── Sticky bottom ─────────────────────────────────────────────────────────
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(221,221,221,0.87)',
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  ctaBtn: {
    flex: 1,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnOutline: { borderWidth: 1, borderColor: '#000', backgroundColor: '#FFF' },
  ctaBtnSolid: { backgroundColor: '#000' },
  ctaBtnDisabled: { opacity: 0.45 },
  ctaBtnOutlineText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#000',
    letterSpacing: 0.5,
  },
  ctaBtnSolidText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFF',
    letterSpacing: 0.5,
  },
});

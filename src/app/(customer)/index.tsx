import { CustomerHeader } from '@/components/common/CustomerHeader';
import { Text } from '@/components/common/Text';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { useCollectorsEditionDrop, useHomepage, useLatestDrop } from '@/hooks/useHomepage';
import { Font, FontSize } from '@/theme/typography';
import type { HeroBanner, HeroSlide } from '@/types/homepage.types';
import { mapHomepageProduct } from '@/types/homepage.types';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

// ── Static data ───────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: 'Rahul Verma',
    location: 'Gurgaon',
    text: "I've owned a few premium eyewear brands before, but 19 Maison truly stands out. The craftsmanship is exceptional, and the design feels both modern and timeless. The frames are incredibly comfortable for all-day wear.",
  },
  {
    name: 'Karan Singh',
    location: 'Chandigarh',
    text: 'Absolutely love my frames from 19 Maison. The quality is top-notch, and the customer service was exceptional. Will definitely be ordering again soon!',
  },
  {
    name: 'Priya Mehta',
    location: 'Mumbai',
    text: 'You can tell this brand focuses on quality over everything else. Received multiple compliments already. Premium feel throughout the whole experience.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'What makes 19 Maison eyewear different?',
    a: 'At 19 Maison, we focus on refined design, premium materials, and timeless aesthetics. Each piece is crafted to balance modern minimalism with luxury, ensuring you wear something that feels as exceptional as it looks.',
  },
  {
    q: 'Are the frames suitable for everyday wear?',
    a: 'Yes, our frames are designed for daily wear with premium materials ensuring durability and comfort.',
  },
  {
    q: 'Do you offer prescription lenses?',
    a: 'Yes, we offer prescription lens fitting for all our frames at our stores.',
  },
  {
    q: 'What materials are used?',
    a: 'We use premium acetate, titanium, and gold-plated materials sourced from the finest manufacturers.',
  },
  {
    q: 'How should I care for my eyewear?',
    a: 'Clean with the provided microfiber cloth, store in the case when not in use, and avoid exposure to extreme heat.',
  },
  {
    q: 'Is 19 Maison eyewear unisex?',
    a: 'Many of our styles are unisex. We also have dedicated collections for men and women.',
  },
];

const GENDER_LABEL: Record<string, string> = {
  MEN: 'Men',
  WOMEN: 'Women',
  UNISEX: 'Unisex',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildHeroSlides(heroSection: HeroBanner[]): HeroSlide[] {
  const slides: HeroSlide[] = [];
  for (const banner of heroSection) {
    for (const doc of banner.documents ?? []) {
      if (doc.imageUrl) {
        slides.push({
          documentId: doc.documentId,
          imageUrl: doc.imageUrl,
          isPrimary: doc.isPrimary,
          displayOrder: doc.displayOrder,
          title: banner.title,
          description: banner.description,
        });
      }
    }
  }
  return slides.sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.displayOrder - b.displayOrder;
  });
}

// ── Dots ──────────────────────────────────────────────────────────────────────

function Dots({ count, active }: { count: number; active: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={i === active ? styles.dotActive : styles.dotInactive} />
      ))}
    </View>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function ProductCardSkeleton({ width = 176 }: { width?: number }) {
  return (
    <View style={{ width, borderWidth: 1, borderColor: 'rgba(221,221,221,0.87)' }}>
      <Skeleton height={140} />
      <View style={{ padding: 8, gap: 4 }}>
        <Skeleton height={10} width="60%" />
        <Skeleton height={12} width="80%" />
      </View>
    </View>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [heroIndex, setHeroIndex] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const heroListRef = useRef<FlatList<HeroSlide>>(null);

  const { data: homepage, isLoading: homepageLoading } = useHomepage();
  const { data: latestDrop, isLoading: latestLoading } = useLatestDrop();
  const { data: collectors, isLoading: collectorsLoading } = useCollectorsEditionDrop();

  const heroSlides = useMemo(
    () => (homepage?.heroSection ? buildHeroSlides(homepage.heroSection) : []),
    [homepage?.heroSection],
  );
  console.log('homepage>>', homepage);
  console.log('latestDrop>>', latestDrop);
  console.log('collectors>>', collectors);

  const latestProducts = useMemo(() => (latestDrop ?? []).map(mapHomepageProduct), [latestDrop]);

  const brandBanner = homepage?.brandBannerSection ?? null;
  const brandsSection = homepage?.brandsSection ?? [];
  const genderSections = (homepage?.shopByGenderSections ?? []).filter(g => g.imageUrl);
  // card width for 2-column grid: full width minus 2×24 horizontal padding minus 12 gap
  const cardWidth = (screenWidth - 48 - 12) / 2;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CustomerHeader showSearch />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Brand Circles ─────────────────────────────────────────────────── */}
        {brandsSection.length > 0 && (
          <View style={styles.brandCirclesSection}>
            <FlatList
              data={brandsSection}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
              keyExtractor={(_, i) => `brand-circle-${i}`}
              renderItem={({ item }: { item: any }) => (
                <TouchableOpacity
                  style={styles.brandCircleItem}
                  onPress={() => router.push('/(customer)/explore')}
                  activeOpacity={0.85}
                >
                  <View style={styles.brandCircleImageWrap}>
                    {item.image ? (
                      <Image
                        source={{ uri: item.image?.imageUrl }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                      />
                    ) : (
                      <LinearGradient
                        colors={['#2A2A2A', '#1A1A1A']}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                  </View>
                  <Text style={styles.brandCircleName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ── Section 1: Hero Slider ────────────────────────────────────────── */}
        {heroSlides.length > 0 ? (
          <View>
            <FlatList
              ref={heroListRef}
              data={heroSlides}
              keyExtractor={s => s.documentId}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={200}
              getItemLayout={(_, i) => ({
                length: screenWidth,
                offset: screenWidth * i,
                index: i,
              })}
              onScrollToIndexFailed={() => {}}
              onScroll={e => {
                const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                setHeroIndex(index);
              }}
              renderItem={({ item }) => (
                <View style={{ width: screenWidth, height: 205, overflow: 'hidden' }}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.heroBannerContent}>
                    {item.title ? <Text style={styles.heroTagline}>{item.title}</Text> : null}
                    {item.description ? (
                      <Text style={styles.heroHeadline}>{item.description}</Text>
                    ) : null}
                    <TouchableOpacity
                      style={styles.heroShopBtn}
                      onPress={() => router.push('/(customer)/explore')}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.heroShopBtnText}>SHOP NOW</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            {heroSlides.length > 1 && (
              <View style={styles.heroDots}>
                <Dots count={heroSlides.length} active={heroIndex} />
              </View>
            )}
          </View>
        ) : homepageLoading ? (
          <Skeleton height={205} />
        ) : null}

        {/* ── Section 2: Latest Drop (2-column grid) ────────────────────────── */}
        {(latestLoading || latestProducts.length > 0) && (
          <View style={styles.latestDropSection}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionHeadingDark}>Latest drop</Text>
              <TouchableOpacity
                onPress={() => router.push('/(customer)/explore')}
                activeOpacity={0.8}
              >
                <Text style={styles.viewMoreGold}>View more</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productGrid}>
              {(latestLoading ? (Array(4).fill(null) as null[]) : latestProducts).map(
                (item: any, i: number) =>
                  latestLoading || !item ? (
                    <ProductCardSkeleton key={i} width={cardWidth} />
                  ) : (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.productGridCard, { width: cardWidth }]}
                      onPress={() => router.push(`/(customer)/product/${item.slug}`)}
                      activeOpacity={0.9}
                    >
                      <View style={styles.productGridImageWrap}>
                        {item.images[0]?.url ? (
                          <Image
                            source={{ uri: item.images[0].url }}
                            style={StyleSheet.absoluteFill}
                            contentFit="cover"
                          />
                        ) : (
                          <LinearGradient
                            colors={['#2A2A2A', '#1A1A1A']}
                            style={StyleSheet.absoluteFill}
                          />
                        )}
                        <TouchableOpacity style={styles.gridHeartBtn} hitSlop={8}>
                          <Text style={styles.gridHeartIcon}>♡</Text>
                        </TouchableOpacity>
                        {/* <View style={styles.gridBagChip}>
                        <Text style={styles.gridBagIcon}>🛍</Text>
                      </View> */}
                      </View>
                      <View style={styles.productGridInfo}>
                        <Text style={styles.productGridSku} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.productGridPrice}>₹ {item.discountedPrice}</Text>
                      </View>
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </View>
        )}

        {/* ── Section 3: Choose by Gender ───────────────────────────────────── */}
        {genderSections.length > 0 && (
          <View style={styles.genderSection}>
            <Text style={styles.sectionHeadingDark}>Choose by gender</Text>
            <View style={styles.genderRow}>
              {genderSections.map(section => (
                <TouchableOpacity
                  key={section.gender}
                  style={styles.genderItem}
                  onPress={() => router.push('/(customer)/explore')}
                  activeOpacity={0.85}
                >
                  <View style={styles.genderCircle}>
                    <Image
                      source={{ uri: section.imageUrl! }}
                      style={styles.genderCircleImage}
                      contentFit="cover"
                    />
                  </View>
                  <Text style={styles.genderLabel}>
                    {GENDER_LABEL[section.gender] ?? section.gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Section 4: Brand Banner ───────────────────────────────────────── */}
        {brandBanner?.imageUrl && brandBanner?.title ? (
          <View style={styles.brandBannerSection}>
            <Image
              source={{ uri: brandBanner.imageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.75)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.brandBannerCard}>
              <Text style={styles.brandBannerName}>{brandBanner.title}</Text>
              <TouchableOpacity
                style={styles.brandBannerShopBtn}
                onPress={() => router.push('/(customer)/explore')}
                activeOpacity={0.8}
              >
                <Text style={styles.brandBannerShopText}>SHOP NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* ── Section 6: Collectors Edition (2-col grid, gold bg) ───────────── */}
        {(collectorsLoading || (collectors ?? []).length > 0) && (
          <View style={styles.collectorsSection}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionHeadingDark}>Collectors Edition</Text>
              <TouchableOpacity
                onPress={() => router.push('/(customer)/explore')}
                activeOpacity={0.8}
              >
                <Text style={styles.viewMoreDark}>View more</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productGrid}>
              {(collectorsLoading ? (Array(4).fill(null) as null[]) : (collectors ?? [])).map(
                (item, i) =>
                  collectorsLoading || !item ? (
                    <View key={i} style={[styles.collectorCard, { width: cardWidth }]}>
                      <Skeleton height={140} />
                      <View style={{ padding: 8, gap: 6 }}>
                        <Skeleton height={10} width="70%" />
                        <Skeleton height={36} />
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.collectorCard, { width: cardWidth }]}
                      onPress={() => router.push(`/(customer)/product/${item.slug}`)}
                      activeOpacity={0.9}
                    >
                      <View style={styles.collectorCardImage}>
                        {item.images[0]?.imageUrl ? (
                          <Image
                            source={{ uri: item.images[0].imageUrl }}
                            style={StyleSheet.absoluteFill}
                            contentFit="cover"
                          />
                        ) : (
                          <LinearGradient
                            colors={['#2A2A2A', '#1A1A1A']}
                            style={StyleSheet.absoluteFill}
                          />
                        )}
                        <TouchableOpacity style={styles.gridHeartBtn} hitSlop={8}>
                          <Text style={styles.gridHeartIcon}>♡</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.collectorCardFooter}>
                        <Text style={styles.collectorCardName} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <TouchableOpacity style={styles.enquiryBtn} activeOpacity={0.85}>
                          <Text style={styles.enquiryBtnText}>ENQUIRY NOW</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </View>
        )}

        {/* ── Section 7: Testimonials ────────────────────────────────────────── */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionHeadingDark}>Some words from our customers</Text>
          <FlatList
            data={TESTIMONIALS}
            keyExtractor={(_, i) => `testimonial-${i}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
            renderItem={({ item }) => (
              <View style={styles.testimonialCard}>
                <View style={styles.testimonialHeader}>
                  <View style={styles.testimonialAvatar}>
                    <LinearGradient
                      colors={['#2A2A2A', '#1A1A1A']}
                      style={StyleSheet.absoluteFill}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.testimonialName}>
                      {item.name}, {item.location}
                    </Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Text key={s} style={styles.starIcon}>
                          ★
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.testimonialText}>{item.text}</Text>
              </View>
            )}
          />
        </View>

        {/* ── Section 11: FAQ ────────────────────────────────────────────────── */}
        <View style={styles.faqSection}>
          <Text style={styles.faqHeading}>Commonly asked questions</Text>
          {FAQ_ITEMS.map((item, i) => (
            <View key={i} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqRow}
                onPress={() => setExpandedFaq(expandedFaq === i ? -1 : i)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestion}>{item.q}</Text>
                <Text style={styles.faqToggle}>{expandedFaq === i ? '−' : '+'}</Text>
              </TouchableOpacity>
              {expandedFaq === i && <Text style={styles.faqAnswer}>{item.a}</Text>}
            </View>
          ))}
        </View>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerCopyrightText}>
            © 2026 19 Maison eyewear, ALL right reserved
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // ── Dots ──────────────────────────────────────────────────────────────────
  dotsRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' },
  dotActive: { width: 24, height: 6, borderRadius: 100, backgroundColor: '#D4AF37' },
  dotInactive: { width: 6, height: 6, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.5)' },

  // ── Brand Circles ─────────────────────────────────────────────────────────
  brandCirclesSection: {
    backgroundColor: '#000000',
    paddingVertical: 16,
  },
  brandCircleItem: {
    alignItems: 'center',
    gap: 6,
    width: 64,
  },
  brandCircleImageWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  brandCircleName: {
    fontFamily: Font.medium,
    fontSize: FontSize.xs,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // ── Section 1: Hero ───────────────────────────────────────────────────────
  heroBannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    justifyContent: 'center',
    gap: 8,
  },
  heroTagline: {
    fontFamily: Font.bold,
    fontSize: FontSize.sm,
    color: '#F9F9F9',
  },
  heroHeadline: {
    fontFamily: Font.semibold,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * 1.24,
    color: '#F9F9F9',
    maxWidth: 241,
  },
  heroShopBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#F9F9F9',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  heroShopBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.xs,
    color: '#000000',
    textTransform: 'uppercase',
  },
  heroDots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },

  // ── Section 2: Latest Drop ────────────────────────────────────────────────
  latestDropSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 20,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeadingDark: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * 1.3,
    color: '#000000',
  },
  viewMoreGold: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#D4AF37',
    textDecorationLine: 'underline',
  },
  viewMoreDark: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#000000',
    textDecorationLine: 'underline',
  },

  // ── 2-column product grid ─────────────────────────────────────────────────
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productGridCard: {
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  productGridImageWrap: {
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  gridHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  gridHeartIcon: {
    fontSize: 18,
    color: '#000000',
  },
  gridBagChip: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  gridBagIcon: {
    fontSize: 12,
  },
  productGridInfo: {
    padding: 8,
    gap: 2,
  },
  productGridSku: {
    fontFamily: Font.regular,
    fontSize: FontSize.sm,
    color: '#626262',
  },
  productGridPrice: {
    fontFamily: Font.bold,
    fontSize: FontSize.base,
    color: '#000000',
  },

  // ── Section 3: Gender ─────────────────────────────────────────────────────
  genderSection: {
    backgroundColor: '#F9F9F9',
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 24,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  genderItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  genderCircle: {
    height: 121,
    borderRadius: 100,
    overflow: 'hidden',
    width: '100%',
  },
  genderCircleImage: {
    width: '100%',
    height: '100%',
  },
  genderLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    color: '#000000',
  },

  // ── Section 4: Brand Banner ────────────────────────────────────────────────
  brandBannerSection: {
    height: 229,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  brandBannerCard: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 24,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 16,
  },
  brandBannerName: {
    fontFamily: Font.bold,
    fontSize: FontSize['5xl'],
    lineHeight: FontSize['5xl'] * 1.2,
    color: '#F9F9F9',
  },
  brandBannerShopBtn: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },
  brandBannerShopText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#F9F9F9',
  },

  // ── Section 6: Collectors Edition ─────────────────────────────────────────
  collectorsSection: {
    backgroundColor: '#D4AF37',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 20,
  },
  collectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  collectorCardImage: {
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  collectorCardFooter: {
    padding: 8,
    gap: 6,
  },
  collectorCardName: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    color: '#626262',
  },
  enquiryBtn: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  enquiryBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.sm,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Section 7: Testimonials ───────────────────────────────────────────────
  testimonialsSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 24,
  },
  testimonialCard: {
    width: 320,
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    padding: 16,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  testimonialName: {
    fontFamily: Font.semibold,
    fontSize: 18,
    color: '#000000',
  },
  starsRow: { flexDirection: 'row', gap: 2 },
  starIcon: { fontSize: 14, color: '#D4AF37' },
  testimonialText: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.6,
    color: '#626262',
  },

  // ── Section 11: FAQ ───────────────────────────────────────────────────────
  faqSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  faqHeading: {
    fontFamily: Font.bold,
    fontSize: FontSize['2xl'],
    color: '#000000',
    marginBottom: 8,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.4)',
  },
  faqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: Font.medium,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.3,
    color: '#000000',
  },
  faqToggle: {
    fontSize: 20,
    color: '#000000',
    width: 20,
    textAlign: 'center',
  },
  faqAnswer: {
    fontFamily: Font.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.6,
    color: '#626262',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerCopyrightText: {
    fontFamily: Font.light,
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});

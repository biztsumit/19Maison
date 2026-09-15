import { CustomerHeader } from '@/components/common/CustomerHeader';
import { Text } from '@/components/common/Text';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { useProductFilters, useProductsInfinite } from '@/hooks/useProducts';
import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import type { Product } from '@/types';
import type { FilterGroup } from '@/types/product.types';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Constants ──────────────────────────────────────────────────────────────

const TRENDING_TAGS = ['Aviator', 'Cartier', 'Capote'] as const;

const EXPLORE_BRANDS = [
  { name: 'Gucci', image: require('../../../assets/images/brand-gucci.png') },
  { name: 'Leimann', image: require('../../../assets/images/brand-leimann.png') },
  { name: 'Dior', image: require('../../../assets/images/brand-dior.png') },
  { name: 'Fendi', image: require('../../../assets/images/brand-fendi.png') },
  { name: 'Givenchy', image: require('../../../assets/images/brand-givenchy.png') },
  { name: 'Dunhill', image: require('../../../assets/images/brand-dunhill.png') },
];

type SortOption = { label: string; sortBy: string; sortOrder: 'asc' | 'desc' };

const SORT_OPTIONS: SortOption[] = [
  { label: 'Best selling', sortBy: 'sales', sortOrder: 'desc' },
  { label: 'Alphabetically A-Z', sortBy: 'name', sortOrder: 'asc' },
  { label: 'Alphabetically Z-A', sortBy: 'name', sortOrder: 'desc' },
  { label: 'Price High to Low', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Price Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Date Old to New', sortBy: 'createdAt', sortOrder: 'asc' },
  { label: 'Date New to Old', sortBy: 'createdAt', sortOrder: 'desc' },
];

// Static fallback filter groups shown before API loads
const FALLBACK_FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'gender',
    label: 'Gender',
    options: [
      { value: 'men', label: 'Men' },
      { value: 'women', label: 'Women' },
      { value: 'unisex', label: 'Unisex' },
    ],
  },
  {
    id: 'price',
    label: 'Price',
    options: [
      { value: 'under-20000', label: 'Under ₹20,000' },
      { value: '20000-40000', label: '₹20,000 – ₹40,000' },
      { value: '40000-80000', label: '₹40,000 – ₹80,000' },
      { value: 'above-80000', label: 'Above ₹80,000' },
    ],
  },
  {
    id: 'brand',
    label: 'Brand',
    options: [
      { value: 'gucci', label: 'Gucci' },
      { value: 'tom-ford', label: 'Tom Ford' },
      { value: 'prada', label: 'Prada' },
      { value: 'cartier', label: 'Cartier' },
      { value: 'dior', label: 'Dior' },
      { value: 'dunhill', label: 'Dunhill' },
    ],
  },
  { id: 'productType', label: 'Product Type', options: [] },
  { id: 'frameSize', label: 'Frame Size', options: [] },
  {
    id: 'color',
    label: 'Frame Color',
    options: [
      { value: 'black', label: 'Black' },
      { value: 'gold', label: 'Gold' },
      { value: 'silver', label: 'Silver' },
      { value: 'tortoise', label: 'Tortoise' },
      { value: 'havana', label: 'Havana' },
      { value: 'green', label: 'Green' },
    ],
  },
  { id: 'lensColor', label: 'Lens Color', options: [] },
  { id: 'rimType', label: 'Rim Type', options: [] },
  { id: 'clipOn', label: 'Clip on', options: [] },
  { id: 'lensProperty', label: 'Lens properties', options: [] },
  { id: 'lensType', label: 'Lens Type', options: [] },
  { id: 'material', label: 'Material', options: [] },
];

// ── Sort Modal ─────────────────────────────────────────────────────────────

function SortModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: SortOption | null;
  onSelect: (opt: SortOption) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={sortStyles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={[sortStyles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {SORT_OPTIONS.map((opt, i) => (
          <TouchableOpacity
            key={opt.label}
            style={[sortStyles.row, i === SORT_OPTIONS.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => {
              onSelect(opt);
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[sortStyles.label, selected?.label === opt.label && sortStyles.labelActive]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const sortStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  row: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
  },
  label: {
    fontFamily: Font.regular,
    fontSize: FontSize.lg,
    color: '#000000',
  },
  labelActive: {
    fontFamily: Font.semibold,
    color: Colors.gold,
  },
});

// ── Filter Modal ───────────────────────────────────────────────────────────

function FilterModal({
  visible,
  filterGroups,
  draftFilters,
  onToggle,
  onApply,
  onReset,
  onClose,
}: {
  visible: boolean;
  filterGroups: FilterGroup[];
  draftFilters: Record<string, string[]>;
  onToggle: (groupId: string, value: string) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleGroup = (id: string) => setExpandedGroup(prev => (prev === id ? null : id));

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <StatusBar style="dark" />
      <View style={[filterStyles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={filterStyles.header}>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Text style={filterStyles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={filterStyles.title}>Filter</Text>
        </View>

        {/* Accordion list */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {filterGroups.map(group => {
            const isOpen = expandedGroup === group.id;
            const selected = draftFilters[group.id] ?? [];
            return (
              <View key={group.id} style={filterStyles.groupWrap}>
                <TouchableOpacity
                  style={filterStyles.groupHeader}
                  onPress={() => toggleGroup(group.id)}
                  activeOpacity={0.7}
                >
                  <Text style={filterStyles.groupLabel}>{group.label}</Text>
                  <Text style={filterStyles.groupToggle}>{isOpen ? '−' : '+'}</Text>
                </TouchableOpacity>

                {isOpen && group.options.length > 0 && (
                  <View style={filterStyles.optionsList}>
                    {group.options.map(opt => {
                      const isChecked = selected.includes(opt.value);
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={filterStyles.optionRow}
                          onPress={() => onToggle(group.id, opt.value)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              filterStyles.checkbox,
                              isChecked && filterStyles.checkboxChecked,
                            ]}
                          >
                            {isChecked && <Text style={filterStyles.checkmark}>✓</Text>}
                          </View>
                          <Text style={filterStyles.optionLabel}>{opt.label}</Text>
                          {opt.count !== undefined && (
                            <Text style={filterStyles.optionCount}>({opt.count})</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Footer buttons */}
        <View style={[filterStyles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity style={filterStyles.resetBtn} onPress={onReset} activeOpacity={0.8}>
            <Text style={filterStyles.resetBtnText}>RESET</Text>
          </TouchableOpacity>
          <TouchableOpacity style={filterStyles.applyBtn} onPress={onApply} activeOpacity={0.8}>
            <Text style={filterStyles.applyBtnText}>APPLY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const filterStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
  },
  backArrow: { fontSize: 22, color: '#000000', fontFamily: Font.regular },
  title: { fontFamily: Font.bold, fontSize: FontSize['2xl'], color: '#000000' },
  groupWrap: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(221,221,221,0.87)',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  groupLabel: { fontFamily: Font.regular, fontSize: FontSize.lg, color: '#000000' },
  groupToggle: { fontSize: 20, color: '#000000' },
  optionsList: { paddingHorizontal: 24, paddingBottom: 16, gap: 16 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  checkmark: { fontSize: 12, color: '#FFFFFF', fontFamily: Font.bold },
  optionLabel: { flex: 1, fontFamily: Font.regular, fontSize: FontSize.md, color: '#000000' },
  optionCount: { fontFamily: Font.regular, fontSize: FontSize.sm, color: '#626262' },
  footer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(221,221,221,0.87)',
  },
  resetBtn: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  applyBtn: {
    flex: 1,
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

// ── Product card ───────────────────────────────────────────────────────────

function ExploreProductCard({ product, cardWidth }: { product: Product; cardWidth: number }) {
  return (
    <TouchableOpacity
      style={[cardStyles.card, { width: cardWidth }]}
      onPress={() => router.push(`/(customer)/product/${product.slug}`)}
      activeOpacity={0.9}
    >
      <View style={cardStyles.imageWrap}>
        {product.images[0]?.url ? (
          <Image
            source={{ uri: product.images[0].url }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        ) : (
          <LinearGradient colors={['#2A2A2A', '#1A1A1A']} style={StyleSheet.absoluteFill} />
        )}
        <TouchableOpacity style={cardStyles.heartBtn} hitSlop={8}>
          <Text style={cardStyles.heartIcon}>♡</Text>
        </TouchableOpacity>
        {/* <View style={cardStyles.bagChip}>
          <Text style={cardStyles.bagIcon}>🛍</Text>
        </View> */}
      </View>
      <View style={cardStyles.info}>
        {product.brand?.name ? (
          <Text style={cardStyles.brand} numberOfLines={1}>
            {product.brand.name.toUpperCase()}
          </Text>
        ) : null}
        <Text style={cardStyles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={cardStyles.price}>₹ {product?.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ProductCardSkeleton({ cardWidth }: { cardWidth: number }) {
  return (
    <View style={[cardStyles.card, { width: cardWidth }]}>
      <Skeleton height={180} />
      <View style={{ padding: 8, gap: 4 }}>
        <Skeleton height={10} width="50%" />
        <Skeleton height={12} width="80%" />
        <Skeleton height={14} width="60%" />
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  imageWrap: { height: 180, overflow: 'hidden', position: 'relative' },
  heartBtn: { position: 'absolute', top: 8, right: 8, zIndex: 1 },
  heartIcon: { fontSize: 20, color: '#000000' },
  bagChip: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  bagIcon: { fontSize: 14 },
  info: { padding: 8, gap: 2 },
  brand: {
    fontFamily: Font.semibold,
    fontSize: FontSize.xs,
    color: '#626262',
  },
  name: { fontFamily: Font.regular, fontSize: FontSize.sm, color: '#626262' },
  price: { fontFamily: Font.bold, fontSize: FontSize.md, color: '#000000' },
});

// ── Main Screen ─────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [draftFilters, setDraftFilters] = useState<Record<string, string[]>>({});

  // Debounce search → avoid API call on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText), 500);
    return () => clearTimeout(t);
  }, [searchText]);

  const cardWidth = Math.floor((screenWidth - 48 - 16) / 2);

  const { data: apiFilterGroups = [] } = useProductFilters();
  const filterGroups = apiFilterGroups.length > 0 ? apiFilterGroups : FALLBACK_FILTER_GROUPS;

  const queryParams = useMemo(
    () => ({
      limit: 20,
      search: debouncedSearch || undefined,
      sortBy: selectedSort?.sortBy,
      sortOrder: selectedSort?.sortOrder,
      brandSlugs: activeFilters['brand']?.length ? activeFilters['brand'] : undefined,
      targetAudience: activeFilters['gender']?.length ? activeFilters['gender'] : undefined,
      shape: activeFilters['shape']?.length ? activeFilters['shape'] : undefined,
      frameColor: activeFilters['color']?.length ? activeFilters['color'] : undefined,
    }),
    [debouncedSearch, selectedSort, activeFilters],
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductsInfinite(queryParams);

  const products = data?.pages.flatMap(p => p.products) ?? [];

  const activeFilterCount = useMemo(
    () => Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0),
    [activeFilters],
  );

  const handleTrendingTag = useCallback((tag: string) => setSearchText(tag), []);

  const openFilter = () => {
    setDraftFilters({ ...activeFilters });
    setShowFilter(true);
  };

  const handleFilterToggle = (groupId: string, value: string) => {
    setDraftFilters(prev => {
      const current = prev[groupId] ?? [];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [groupId]: next };
    });
  };

  const handleFilterApply = () => {
    setActiveFilters({ ...draftFilters });
    setShowFilter(false);
  };

  const handleFilterReset = () => {
    setDraftFilters({});
    setActiveFilters({});
    setShowFilter(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Black header block ────────────────────────────────────────────── */}
        <CustomerHeader showSearch={false} />

        {/* Search bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#626262"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Trending searches */}
        <View style={styles.trendingRow}>
          <Text style={styles.trendingLabel}>Trending Searches</Text>
          {TRENDING_TAGS.map(tag => (
            <TouchableOpacity key={tag} onPress={() => handleTrendingTag(tag)} activeOpacity={0.7}>
              <Text style={styles.trendingTag}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Brand circles */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandCirclesContent}
          style={styles.brandCirclesList}
        >
          {EXPLORE_BRANDS.map(brand => (
            <TouchableOpacity key={brand.name} style={styles.brandCircleItem} activeOpacity={0.85}>
              <View style={styles.brandCircleWrap}>
                <Image source={brand.image} style={StyleSheet.absoluteFill} contentFit="cover" />
              </View>
              <Text style={styles.brandCircleName}>{brand.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Filter / Sort toolbar ─────────────────────────────────────────── */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarBtn} onPress={openFilter} activeOpacity={0.8}>
            <Text style={styles.toolbarBtnText}>Filter</Text>
            <Text style={styles.filterIcon}>⊞</Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.toolbarDivider} />
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={() => setShowSort(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.toolbarBtnText}>Sort</Text>
            <Text style={styles.sortArrow}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* ── Product grid ──────────────────────────────────────────────────── */}
        <View style={styles.productGrid}>
          {isLoading
            ? (Array(8).fill(null) as null[]).map((_, i) => (
                <ProductCardSkeleton key={i} cardWidth={cardWidth} />
              ))
            : products.map(product => (
                <ExploreProductCard key={product.id} product={product} cardWidth={cardWidth} />
              ))}
          {console.log('products>>>', products)}
        </View>

        {/* ── Load More ────────────────────────────────────────────────────── */}
        {!isLoading && hasNextPage && (
          <TouchableOpacity
            style={styles.loadMoreBtn}
            onPress={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            activeOpacity={0.8}
          >
            {isFetchingNextPage ? (
              <ActivityIndicator color={Colors.gold} size="small" />
            ) : (
              <Text style={styles.loadMoreText}>Load more</Text>
            )}
          </TouchableOpacity>
        )}

        {/* ── Empty state ───────────────────────────────────────────────────── */}
        {!isLoading && products.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Sort bottom sheet ─────────────────────────────────────────────── */}
      <SortModal
        visible={showSort}
        selected={selectedSort}
        onSelect={setSelectedSort}
        onClose={() => setShowSort(false)}
      />

      {/* ── Filter full-screen modal ──────────────────────────────────────── */}
      <FilterModal
        visible={showFilter}
        filterGroups={filterGroups}
        draftFilters={draftFilters}
        onToggle={handleFilterToggle}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        onClose={() => setShowFilter(false)}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 40 },

  // ── Black header block ──────────────────────────────────────────────────
  searchSection: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchIcon: { fontSize: 20, color: '#626262', fontFamily: Font.regular },
  searchInput: {
    flex: 1,
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    color: '#000000',
    padding: 0,
    margin: 0,
  },

  trendingRow: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  trendingLabel: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: Colors.gold,
  },
  trendingTag: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },

  brandCirclesList: { backgroundColor: '#000000' },
  brandCirclesContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  brandCircleItem: { alignItems: 'center', gap: 8, width: 72 },
  brandCircleWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  brandCircleName: {
    fontFamily: Font.bold,
    fontSize: FontSize.sm,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // ── Toolbar ─────────────────────────────────────────────────────────────
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
    backgroundColor: '#FFFFFF',
  },
  toolbarBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  toolbarBtnText: { fontFamily: Font.medium, fontSize: FontSize.md, color: '#000000' },
  filterIcon: { fontSize: 16, color: '#000000' },
  filterBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: { fontFamily: Font.bold, fontSize: 10, color: '#FFFFFF' },
  sortArrow: { fontSize: 14, color: '#000000' },
  toolbarDivider: { width: 1, height: 24, backgroundColor: 'rgba(221,221,221,0.87)' },

  // ── Product grid ─────────────────────────────────────────────────────────
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  // ── Load More ────────────────────────────────────────────────────────────
  loadMoreBtn: {
    marginHorizontal: 24,
    marginTop: 24,
    height: 48,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: { fontFamily: Font.medium, fontSize: FontSize.md, color: '#000000' },

  // ── Empty ────────────────────────────────────────────────────────────────
  emptyState: { paddingVertical: 56, alignItems: 'center' },
  emptyText: { fontFamily: Font.regular, fontSize: FontSize.md, color: '#626262' },
});

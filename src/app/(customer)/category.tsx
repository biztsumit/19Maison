import { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Font, FontSize } from '@/theme/typography';
import { Colors } from '@/theme/colors';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@/hooks/useNavigation';

// ── Static data (images + shapes — not in navigation API) ─────────────────

const SHAPE_TILES = [
  { label: 'Angular', gradient: ['#1A1A1A', '#333333'] as const },
  { label: 'Aviator', gradient: ['#101820', '#2C2C2C'] as const },
  { label: 'Butterfly', gradient: ['#1A1A2E', '#22224A'] as const },
  { label: 'Round', gradient: ['#0D0D0D', '#2A2A2A'] as const },
  { label: 'Rectangle', gradient: ['#1C1C1C', '#383838'] as const },
  { label: 'Clubmaster', gradient: ['#111827', '#2D2D2D'] as const },
];

const BRAND_TILES = [
  { name: 'Gucci', image: require('../../../assets/images/brand-gucci.png') },
  { name: 'Leimann', image: require('../../../assets/images/brand-leimann.png') },
  { name: 'Dior', image: require('../../../assets/images/brand-dior.png') },
  { name: 'Fendi', image: require('../../../assets/images/brand-fendi.png') },
  { name: 'Givenchy', image: require('../../../assets/images/brand-givenchy.png') },
  { name: 'Dunhill', image: require('../../../assets/images/brand-dunhill.png') },
];

const GENDER_GRADIENTS: Record<string, readonly [string, string]> = {
  men: ['#1A1A2E', '#2C2C4A'],
  women: ['#2D1B3D', '#4A2A5A'],
  unisex: ['#1A2A1A', '#2A3A2A'],
};

type SectionKey = 'gender' | 'shape' | 'bestSellers' | 'brands';

const SECTION_LABELS: Record<SectionKey, string> = {
  gender: 'Shop by Gender',
  shape: 'Shop by Shape',
  bestSellers: 'Best Sellers',
  brands: 'Shop by Brands',
};

// ── Screen ─────────────────────────────────────────────────────────────────

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { data: navData, isLoading } = useNavigation();

  const [expanded, setExpanded] = useState<Set<SectionKey>>(
    new Set(['gender', 'shape', 'bestSellers', 'brands']),
  );

  const toggle = (key: SectionKey) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const tileSize = (screenWidth - 48 - 32) / 3;

  // Build gender tiles from navigation API, fall back to static
  const genderTiles = useMemo(() => {
    if (navData && navData.length > 0) {
      return navData.map(cat => ({
        label: cat.label,
        key: cat.key,
        gradient: GENDER_GRADIENTS[cat.key.toLowerCase()] ?? ['#1A1A1A', '#2A2A2A'] as const,
      }));
    }
    return [
      { label: 'Men', key: 'men', gradient: GENDER_GRADIENTS.men },
      { label: 'Women', key: 'women', gradient: GENDER_GRADIENTS.women },
      { label: 'Unisex', key: 'unisex', gradient: GENDER_GRADIENTS.unisex },
    ];
  }, [navData]);

  const renderSection = (key: SectionKey) => {
    const isOpen = expanded.has(key);
    return (
      <View key={key} style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggle(key)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>{SECTION_LABELS[key]}</Text>
          <SymbolView
            name={isOpen ? 'chevron.up' : 'chevron.down'}
            size={18}
            tintColor="#000000"
            fallback={<Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>}
          />
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.sectionContent}>
            {key === 'gender' && (
              <View style={styles.tilesRow}>
                {genderTiles.map(g => (
                  <TouchableOpacity
                    key={g.key}
                    style={[styles.tile, { width: tileSize }]}
                    onPress={() =>
                      router.push({
                        pathname: '/(customer)/explore',
                        params: { gender: g.key },
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <LinearGradient colors={g.gradient as any} style={styles.tileImage} />
                    <Text style={styles.tileLabel}>{g.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {key === 'shape' && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {SHAPE_TILES.map(s => (
                  <TouchableOpacity
                    key={s.label}
                    style={[styles.tile, { width: 116 }]}
                    onPress={() =>
                      router.push({
                        pathname: '/(customer)/explore',
                        params: { shape: s.label.toLowerCase() },
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <LinearGradient colors={s.gradient} style={styles.tileImage} />
                    <Text style={styles.tileLabel}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {(key === 'bestSellers' || key === 'brands') && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {BRAND_TILES.map(b => (
                  <TouchableOpacity
                    key={b.name}
                    style={[styles.tile, { width: 116 }]}
                    onPress={() =>
                      router.push({
                        pathname: '/(customer)/explore',
                        params: { brand: b.name.toLowerCase() },
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Image source={b.image} style={styles.tileImage} contentFit="cover" />
                    <Text style={styles.tileLabel}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.gold} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {(['gender', 'shape', 'bestSellers', 'brands'] as SectionKey[]).map(renderSection)}
        </ScrollView>
      )}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 40 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
  },
  headerTitle: {
    fontFamily: Font.semibold,
    fontSize: 24,
    color: '#000000',
    lineHeight: 24,
  },

  section: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize.lg,
    color: '#000000',
  },
  chevron: { fontSize: 12, color: '#000000' },
  sectionContent: { paddingBottom: 20 },

  tilesRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 16 },
  horizontalScroll: { paddingHorizontal: 24, gap: 16 },

  tile: { alignItems: 'center', gap: 8 },
  tileImage: { width: '100%', height: 116, borderRadius: 8 },
  tileLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    color: '#000000',
    textAlign: 'center',
  },
});

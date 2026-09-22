import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/common/Text';
import { Font, FontSize } from '@/theme/typography';

// ─── Data ─────────────────────────────────────────────────────────────────────

const GENDER_ITEMS = [
  { label: 'Men', image: require('../../../../assets/images/gender-men.png') },
  { label: 'Women', image: require('../../../../assets/images/gender-women.png') },
  { label: 'Unisex', image: null },
] as const;

const SHAPE_ITEMS = [
  'Angular',
  'Aviator',
  'Butterfly',
  'Round',
  'Rectangle',
  'Clubmaster',
] as const;

const BRAND_ITEMS = [
  { label: 'Gucci', image: require('../../../../assets/images/brand-gucci.png') },
  { label: 'Leimann', image: require('../../../../assets/images/brand-leimann.png') },
  { label: 'Dior', image: require('../../../../assets/images/brand-dior.png') },
  { label: 'Fendi', image: require('../../../../assets/images/brand-fendi.png') },
  { label: 'Givenchy', image: require('../../../../assets/images/brand-givenchy.png') },
] as const;

const SECTIONS = ['Shop by gender', 'Shop by Shape', 'Best Sellers', 'Shop by Brands'] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  const itemWidth = (screenWidth - 48 - 32) / 3;

  function toggleSection(index: number) {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  // ── Section 1: Shop by gender ──────────────────────────────────────────────

  function renderGenderContent() {
    return (
      <View style={styles.genderRow}>
        {GENDER_ITEMS.map(item => (
          <TouchableOpacity
            key={item.label}
            style={[styles.genderItem, { width: itemWidth }]}
            activeOpacity={0.8}
            onPress={() => router.push('/(staff)/(tabs)/cart')}
          >
            {item.image ? (
              <Image
                source={item.image}
                style={[styles.genderImage, { width: itemWidth }]}
                contentFit="cover"
              />
            ) : (
              <LinearGradient
                colors={['#2A2A2A', '#0A0A0A']}
                style={[styles.genderImage, { width: itemWidth }]}
              />
            )}
            <Text style={styles.genderLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // ── Section 2: Shop by Shape ───────────────────────────────────────────────

  function renderShapeContent() {
    return (
      <View style={styles.shapeGrid}>
        {SHAPE_ITEMS.map(shape => (
          <View key={shape} style={[styles.shapeItem, { width: itemWidth }]}>
            <LinearGradient
              colors={['#1A1A1A', '#2A2A2A']}
              style={[styles.shapeBox, { width: itemWidth, height: itemWidth }]}
            />
            <Text style={styles.shapeLabel}>{shape}</Text>
          </View>
        ))}
      </View>
    );
  }

  // ── Sections 3 & 4: Brands FlatList ───────────────────────────────────────

  function renderBrandsContent(bold: boolean) {
    return (
      <FlatList
        data={BRAND_ITEMS}
        keyExtractor={item => item.label}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={({ item }) => (
          <View style={styles.brandItem}>
            <Image source={item.image} style={styles.brandImage} contentFit="cover" />
            <Text style={[styles.brandLabel, bold && styles.brandLabelBold]}>{item.label}</Text>
          </View>
        )}
      />
    );
  }

  // ── Accordion helper ───────────────────────────────────────────────────────

  function renderSection(index: number) {
    const isOpen = openSections.has(index);
    const title = SECTIONS[index];

    let content: React.ReactNode = null;
    if (index === 0) content = renderGenderContent();
    else if (index === 1) content = renderShapeContent();
    else if (index === 2) content = renderBrandsContent(false);
    else if (index === 3) content = renderBrandsContent(true);

    return (
      <View key={index}>
        <TouchableOpacity
          style={styles.sectionHeader}
          activeOpacity={0.7}
          onPress={() => toggleSection(index)}
        >
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.chevron}>{isOpen ? '▾' : '▸'}</Text>
        </TouchableOpacity>
        {isOpen && <View style={styles.sectionContent}>{content}</View>}
      </View>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 50 }]}>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {[0, 1, 2, 3].map(i => renderSection(i))}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
  },
  headerTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    color: '#000000',
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Accordion header
  sectionHeader: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * 1.3,
    color: '#000000',
  },
  chevron: {
    fontSize: 20,
    color: '#000000',
  },
  sectionContent: {
    paddingBottom: 24,
  },

  // Gender section
  genderRow: {
    flexDirection: 'row',
    gap: 16,
  },
  genderItem: {
    alignItems: 'center',
    gap: 8,
  },
  genderImage: {
    height: 180,
    borderRadius: 8,
  },
  genderLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    color: '#000000',
    textAlign: 'center',
  },

  // Shape section
  shapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  shapeItem: {
    alignItems: 'center',
    gap: 8,
  },
  shapeBox: {
    borderRadius: 8,
  },
  shapeLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    color: '#000000',
    textAlign: 'center',
  },

  // Brand section
  brandItem: {
    alignItems: 'center',
    gap: 8,
  },
  brandImage: {
    width: 116,
    height: 116,
    borderRadius: 8,
  },
  brandLabel: {
    fontFamily: Font.medium,
    fontSize: FontSize.sm,
    color: '#000000',
    textAlign: 'center',
  },
  brandLabelBold: {
    fontFamily: Font.bold,
  },
});

import { Colors } from '@/theme/colors';
import { Font, FontSize } from '@/theme/typography';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';

interface CustomerHeaderProps {
  showSearch?: boolean;
  onSearchPress?: () => void;
}

// Figma: black bg + blur, logo centered (44px), search bar below (F5F5F5, radius 12)
export function CustomerHeader({ showSearch = true, onSearchPress }: CustomerHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      router.push('/(customer)/explore');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Logo row */}
      <View style={styles.logoRow}>
        <Image
          source={require('../../../assets/images/appLogo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {/* Search bar — Figma: #F5F5F5 bg, borderRadius 12, padding 12 16 */}
      {showSearch && (
        <TouchableOpacity
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>⌕</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Figma: #000000 bg + backdropFilter blur(40px), padding 50px 24px 24px
  container: {
    backgroundColor: Colors.sectionDark,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },

  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Figma: Logo SVG 44px height, full width
  logo: {
    width: 210,
    height: 44,
  },

  // Figma: #F5F5F5 fill, borderRadius 12px, padding 12px 16px, row space-between
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  // Figma: search icon 22×22
  searchIcon: {
    fontSize: 20,
    color: Colors.textGray,
    fontFamily: Font.regular,
  },

  // Figma: placeholder Poppins Medium 14, #626262
  searchPlaceholder: {
    fontFamily: Font.medium,
    fontSize: FontSize.base,
    color: Colors.textGray,
    flex: 1,
  },
});

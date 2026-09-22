import { Pressable, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store';
import { selectCartItemCount } from '@/store/selectors/cart.selectors';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { SearchField } from '../ui/SearchField';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

export type HeaderVariant = 'logo' | 'title' | 'back' | 'shop';

interface Props {
  variant?: HeaderVariant;
  title?: string;
  showSearch?: boolean;
  showCart?: boolean;
  right?: ReactNode;
  onBackPress?: () => void;
  onSearchPress?: () => void;
}

// One header replacing the shared CustomerHeader plus six locally-defined BackHeaders.
export function CustomerHeader({
  variant = 'logo',
  title,
  showSearch = false,
  showCart = false,
  right,
  onBackPress,
  onSearchPress,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const cartCount = useAppSelector(selectCartItemCount);
  const onDark = variant === 'logo';
  const iconColor = onDark ? colors.textInverse : colors.text;

  const handleBack = () => (onBackPress ? onBackPress() : router.back());
  const handleSearch = () =>
    onSearchPress ? onSearchPress() : router.push('/(customer)/(tabs)/explore');

  return (
    <View
      style={[
        styles.container,
        onDark ? styles.dark : styles.light,
        { paddingTop: insets.top + Spacing[2] },
      ]}
    >
      <View style={styles.row}>
        {(variant === 'back' || variant === 'shop') && (
          <Pressable onPress={handleBack} hitSlop={10} accessibilityLabel="Go back">
            <Icon name="chevron-left" size={24} color={iconColor} />
          </Pressable>
        )}

        {variant === 'logo' ? (
          <View style={styles.logoWrap}>
            <Image
              source={require('../../../../assets/images/appLogo.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
        ) : (
          <Text
            variant="screenTitle"
            tone={onDark ? 'inverse' : 'default'}
            numberOfLines={1}
            style={styles.title}
          >
            {title}
          </Text>
        )}

        {right}

        {showCart && (
          <Pressable
            onPress={() => router.push('/(customer)/(tabs)/cart')}
            hitSlop={10}
            accessibilityLabel="Cart"
            style={styles.cartWrap}
          >
            <Icon name="bag" size={22} color={iconColor} />
            <Badge count={cartCount} style={styles.cartBadge} />
          </Pressable>
        )}
      </View>

      {showSearch && <SearchField readOnly onPress={handleSearch} />}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingBottom: Spacing[4],
      gap: Spacing[4],
    },
    dark: { backgroundColor: c.bgDark },
    light: {
      backgroundColor: c.bg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], minHeight: 44 },
    logoWrap: { flex: 1, alignItems: 'center' },
    logo: { width: 180, height: 40 },
    title: { flex: 1 },
    cartWrap: { padding: Spacing[1] },
    cartBadge: { position: 'absolute', top: -2, right: -4 },
  });

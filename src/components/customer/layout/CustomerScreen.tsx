import { useCallback, useMemo, useRef } from 'react';
import { RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResetOnTabPress } from '@/hooks/useResetOnTabPress';
import { useTabBarInset } from './TabBar';
import { useTheme } from '@/theme/theme-provider';

interface Props {
  header?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  background?: 'white' | 'offWhite';
  edges?: { top?: boolean; bottom?: boolean };
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}

// Owns the safe-area arithmetic that was repeated across every customer screen.
export function CustomerScreen({
  header,
  footer,
  scroll = true,
  refreshing = false,
  onRefresh,
  background = 'white',
  edges,
  contentContainerStyle,
  children,
}: Props) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bg = background === 'white' ? colors.bg : colors.bgAlt;

  // Non-zero only inside the customer tabs, whose bar floats over the page. It
  // already covers the bottom safe area, so the two must not both be applied.
  const tabInset = useTabBarInset();
  const bottomSafe = tabInset > 0 ? 0 : insets.bottom;

  // Added to whatever the screen asked for rather than replacing it — several
  // screens set their own bottom padding.
  const contentStyle = useMemo<StyleProp<ViewStyle>>(() => {
    if (!tabInset) return contentContainerStyle;
    const flat = StyleSheet.flatten(contentContainerStyle) ?? {};
    const own = typeof flat.paddingBottom === 'number' ? flat.paddingBottom : 0;
    return [contentContainerStyle, { paddingBottom: own + tabInset }];
  }, [contentContainerStyle, tabInset]);

  // Re-entering a tab returns it to the top. Harmless elsewhere: screens outside a
  // tab navigator simply never receive the event.
  const scrollRef = useRef<ScrollView>(null);
  useResetOnTabPress(useCallback(() => scrollRef.current?.scrollTo({ y: 0, animated: false }), []));

  const body = scroll ? (
    <ScrollView
      ref={scrollRef}
      style={styles.flex}
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <View
      style={[
        styles.flex,
        { backgroundColor: bg },
        edges?.top !== false && { paddingTop: header ? 0 : insets.top },
        edges?.bottom !== false && !footer && { paddingBottom: bottomSafe },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {header}
      {body}
      {/* A sticky footer sits above the tab bar, not behind its blur. */}
      {footer ? <View style={{ paddingBottom: tabInset }}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

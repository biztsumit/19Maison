import { FlatList, StyleSheet, View } from 'react-native';
import type { ReactElement } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';

interface Props<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactElement;
  keyExtractor: (item: T, index: number) => string;
  itemWidth?: number;
  gap?: number;
  snap?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

// The web uses plain overflow-x rows for Collectors, Brands, Instagram and Related.
export function HorizontalRail<T>({
  data,
  renderItem,
  keyExtractor,
  itemWidth,
  gap = Spacing[3],
  snap = false,
  contentStyle,
}: Props<T>) {
  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      renderItem={({ item, index }) => renderItem(item, index)}
      ItemSeparatorComponent={() => <View style={{ width: gap }} />}
      contentContainerStyle={[styles.content, contentStyle]}
      snapToInterval={snap && itemWidth ? itemWidth + gap : undefined}
      decelerationRate={snap ? 'fast' : 'normal'}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: CustomerLayout.screenPaddingH },
});

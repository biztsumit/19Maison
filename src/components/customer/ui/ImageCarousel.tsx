import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import type { ImageContentFit } from 'expo-image';
import type { ReactNode } from 'react';
import { CustomerColors } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Text } from './Text';

interface Props {
  images: string[];
  width: number;
  height: number;
  contentFit?: ImageContentFit;
  showDots?: boolean;
  showCounter?: boolean;
  onIndexChange?: (index: number) => void;
  // Drive the carousel from outside (thumbnail strip selection).
  activeIndex?: number;
  renderOverlay?: (index: number) => ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ImageCarousel({
  images,
  width,
  height,
  contentFit = 'cover',
  showDots = false,
  showCounter = false,
  onIndexChange,
  activeIndex,
  renderOverlay,
  style,
}: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    if (activeIndex === undefined || activeIndex === index) return;
    setIndex(activeIndex);
    listRef.current?.scrollToIndex({ index: activeIndex, animated: true });
    // `index` is intentionally excluded: this syncs external -> internal only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(e.nativeEvent.contentOffset.x / width);
      if (next !== index) {
        setIndex(next);
        onIndexChange?.(next);
      }
    },
    [index, width, onIndexChange],
  );

  return (
    <View style={[{ width, height }, style]}>
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={(uri, i) => `${uri}-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height }}
            contentFit={contentFit}
            cachePolicy="memory-disk"
            transition={200}
          />
        )}
      />

      {renderOverlay?.(index)}

      {showCounter && images.length > 1 && (
        <View style={styles.counter}>
          <Text variant="caption" tone="inverse">
            {index + 1}/{images.length}
          </Text>
        </View>
      )}

      {showDots && images.length > 1 && (
        <View style={styles.dots}>
          {images.map((uri, i) => (
            <View key={`${uri}-${i}`} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    position: 'absolute',
    bottom: Spacing[3],
    alignSelf: 'center',
    paddingHorizontal: Spacing[2.5],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    backgroundColor: CustomerColors.overlayMedium,
  },
  dots: {
    position: 'absolute',
    bottom: Spacing[4],
    alignSelf: 'center',
    flexDirection: 'row',
    gap: Spacing[1.5],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: CustomerColors.frostedLight,
  },
  dotActive: { backgroundColor: CustomerColors.accent, width: 18 },
});

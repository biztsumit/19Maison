import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
  borderRadius?: number;
}

export function Skeleton({ width = '100%', height = 16, style, borderRadius = 0 }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as number, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton height={180} />
      <View style={styles.info}>
        <Skeleton height={10} width="50%" />
        <Skeleton height={14} width="80%" />
        <Skeleton height={14} width="40%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.surfaceHighlight,
  },
  card: {
    width: 160,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  info: {
    padding: 12,
    gap: 8,
  },
});

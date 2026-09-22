import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { Spacing } from '@/theme/spacing';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 16, radius = 0, style }: Props) {
  const styles = useThemedStyles(makeStyles);
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityRole="progressbar"
      style={[styles.block, { width, height, borderRadius: radius, opacity }, style]}
    />
  );
}

interface TextSkeletonProps {
  lines?: number;
  widths?: DimensionValue[];
  lineHeight?: number;
  gap?: number;
}

export function SkeletonText({
  lines = 2,
  widths,
  lineHeight = 12,
  gap = Spacing[2],
}: TextSkeletonProps) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={widths?.[i] ?? (i === lines - 1 ? '60%' : '100%')}
        />
      ))}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    block: { backgroundColor: c.skeleton },
  });

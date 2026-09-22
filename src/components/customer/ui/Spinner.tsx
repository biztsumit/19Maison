import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from '@/theme/theme-provider';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const SIZES: Record<SpinnerSize, number> = { sm: 18, md: 28, lg: 44 };

interface Props {
  size?: SpinnerSize | number;
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}

// A gold arc sweeping a faint track, rather than the platform ActivityIndicator —
// that one is grey on iOS and Material-blue on Android, so it looked borrowed on
// every screen. Driven natively, so it keeps spinning while JS is busy (which is
// exactly when a spinner is on screen).
export function Spinner({ size = 'md', color, trackColor, style }: Props) {
  const colors = useThemeColors();
  const diameter = typeof size === 'number' ? size : SIZES[size];
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // Stroke scales with the circle so the small and large sizes read the same.
  const stroke = Math.max(2, Math.round(diameter * 0.1));
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={[{ width: diameter, height: diameter }, style]} accessibilityRole="progressbar">
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={diameter} height={diameter}>
          <Circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={trackColor ?? colors.border}
            strokeWidth={stroke}
            fill="none"
          />
          {/* A quarter-turn arc: enough to read as motion without looking like a
              progress value. */}
          <Circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={color ?? colors.accent}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.25} ${circumference}`}
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

// Fills whatever space it is given. For a screen that has nothing to show yet.
export function LoadingView({ size = 'lg', style }: Pick<Props, 'size' | 'style'>) {
  return (
    <View style={[styles.center, style]}>
      <Spinner size={size} />
    </View>
  );
}

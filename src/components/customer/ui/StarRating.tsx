import { Pressable, StyleSheet, View } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import { Text } from './Text';

interface Props {
  value: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
  reviewCount?: number;
}

const MAX = 5;

export function StarRating({
  value,
  size = 16,
  interactive = false,
  onRate,
  showValue = false,
  reviewCount,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.stars}>
        {Array.from({ length: MAX }).map((_, i) => {
          const fillFraction = Math.max(0, Math.min(1, value - i));
          const star = (
            <View style={{ width: size, height: size }}>
              <Icon
                name="star"
                size={size}
                color={CustomerColors.border}
                fill={CustomerColors.border}
              />
              {fillFraction > 0 && (
                <View style={[styles.fillClip, { width: size * fillFraction, height: size }]}>
                  <Icon
                    name="star"
                    size={size}
                    color={CustomerColors.accent}
                    fill={CustomerColors.accent}
                  />
                </View>
              )}
            </View>
          );

          if (!interactive) return <View key={i}>{star}</View>;

          return (
            <Pressable
              key={i}
              onPress={() => onRate?.(i + 1)}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel={'Rate ' + (i + 1) + ' of ' + MAX}
            >
              {star}
            </Pressable>
          );
        })}
      </View>

      {showValue && <Text variant="bodySmall">{value.toFixed(1)}</Text>}
      {reviewCount !== undefined && (
        <Text variant="bodySmallMuted">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  stars: { flexDirection: 'row', gap: Spacing[0.5] },
  fillClip: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
});

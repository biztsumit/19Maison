import { StyleSheet, View } from 'react-native';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Skeleton } from '../ui/Skeleton';

interface Props {
  width: number;
  imageHeight?: number;
}

// Mirrors ProductCard's box model so the grid does not reflow on load.
export function ProductCardSkeleton({ width, imageHeight }: Props) {
  const height = imageHeight ?? Math.round(width * 0.85);

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.topRow}>
        <Skeleton width={18} height={18} radius={9} />
        <Skeleton width={18} height={18} radius={9} />
      </View>
      <Skeleton width={width} height={height} />
      <View style={styles.info}>
        <Skeleton width="55%" height={12} />
        <Skeleton width="80%" height={12} />
        <Skeleton width="40%" height={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: CustomerColors.border,
    borderRadius: CustomerLayout.cardRadius,
    backgroundColor: CustomerColors.bg,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[3],
    paddingTop: Spacing[3],
  },
  info: { paddingHorizontal: Spacing[3], paddingBottom: Spacing[3], gap: Spacing[2] },
});

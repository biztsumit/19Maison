import { Pressable, StyleSheet, View } from 'react-native';
import { Thumbnail } from '../ui/Thumbnail';
import type { Order } from '@/types/order.types';
import { Spacing } from '@/theme/spacing';
import { orderStatusLabel, orderStatusTone } from '@/utils/order-status';
import { formatDate, formatOrderNumber, formatPrice } from '@/utils/formatters';
import { StatusBadge } from '../ui/StatusBadge';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  order: Order;
  onPress: (order: Order) => void;
  footer?: React.ReactNode;
}

export function OrderCard({ order, onPress, footer }: Props) {
  const styles = useThemedStyles(makeStyles);
  const first = order.items?.[0];
  if (!first) return null;

  const image = first.imageUrl;
  const extraCount = (order.items?.length ?? 0) - 1;

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onPress(order)}
        accessibilityRole="button"
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <Thumbnail uri={image} style={styles.image} />

        <View style={styles.info}>
          <StatusBadge
            label={orderStatusLabel(order.status)}
            tone={orderStatusTone(order.status)}
          />

          <Text variant="cardBrand" numberOfLines={1}>
            {first.brandName}
          </Text>
          <Text variant="bodySmallMuted" numberOfLines={2}>
            {first.modelNumber}
            {extraCount > 0 ? ` +${extraCount} more` : ''}
          </Text>

          <Text variant="caption">
            {formatOrderNumber(order.orderNumber)}
            {order.createdAt ? ` - ${formatDate(order.createdAt)}` : ''}
          </Text>
          <Text variant="cardPrice">{formatPrice(order.total)}</Text>
        </View>
      </Pressable>

      {footer}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.bg,
    },
    main: { flexDirection: 'row', gap: Spacing[4], padding: Spacing[4] },
    pressed: { opacity: 0.9 },
    image: { width: 72, height: 96, backgroundColor: c.bgAlt },
    info: { flex: 1, gap: Spacing[1] },
  });

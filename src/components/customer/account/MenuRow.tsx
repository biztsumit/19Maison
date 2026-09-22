import { Pressable, StyleSheet, View } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';
import type { IconName } from '../ui/Icon';
import { Text } from '../ui/Text';

interface Props {
  icon: IconName;
  label: string;
  subtitle?: string;
  badge?: number;
  onPress: () => void;
}

export function MenuRow({ icon, label, subtitle, badge, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>
        <Icon name={icon} size={20} color={CustomerColors.textInverse} />
      </View>

      <View style={styles.text}>
        <Text variant="cardTitle">{label}</Text>
        {subtitle && <Text variant="caption">{subtitle}</Text>}
      </View>

      {badge !== undefined && badge > 0 && <Text variant="bodySmallMuted">{badge}</Text>}
      <Icon name="chevron-right" size={18} color={CustomerColors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CustomerColors.border,
  },
  pressed: { opacity: 0.7 },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: CustomerColors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: Spacing[0.5] },
});

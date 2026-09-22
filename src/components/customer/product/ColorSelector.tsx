import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Text } from '../ui/Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

export interface ColorOption {
  id: string;
  label: string;
  hex?: string;
  thumbnailUrl?: string;
}

interface Props {
  colors: ColorOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ColorSelector({ colors, selectedId, onSelect }: Props) {
  const styles = useThemedStyles(makeStyles);
  const palette = useThemeColors();
  if (colors.length === 0) return null;
  const selected = colors.find(c => c.id === selectedId);

  return (
    <View style={styles.wrap}>
      <Text variant="cardTitle">Colours{selected ? `: ${selected.label}` : ''}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {colors.map(color => {
            const isSelected = color.id === selectedId;
            return (
              <Pressable
                key={color.id}
                onPress={() => onSelect(color.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={color.label}
                style={[styles.swatch, isSelected && styles.selected]}
              >
                {color.thumbnailUrl ? (
                  <Image
                    source={{ uri: color.thumbnailUrl }}
                    style={styles.fill}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.fill, { backgroundColor: color.hex ?? palette.bgAlt }]} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    wrap: { gap: Spacing[3] },
    row: { flexDirection: 'row', gap: Spacing[3] },
    swatch: {
      width: CustomerLayout.swatchSize,
      height: CustomerLayout.swatchSize,
      borderWidth: 2,
      borderColor: c.border,
      overflow: 'hidden',
    },
    selected: { borderColor: c.accent },
    fill: { width: '100%', height: '100%' },
  });

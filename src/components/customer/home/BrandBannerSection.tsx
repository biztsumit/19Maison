import { StyleSheet, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import type { BrandBanner } from '@/types/homepage.types';
import { Spacing } from '@/theme/spacing';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import { FrostedCard } from '../layout/FrostedCard';
import { FullBleedBanner } from '../layout/FullBleedBanner';

interface Props {
  banner: BrandBanner | null;
}

export function BrandBannerSection({ banner }: Props) {
  const { width } = useWindowDimensions();
  if (!banner?.imageUrl) return null;

  return (
    <FullBleedBanner
      imageUrl={banner.imageUrl}
      height={Math.round(width * 0.9)}
      overlay="light"
      align="bottom"
    >
      <FrostedCard tone="dark" style={styles.card}>
        {banner.title && <Text variant="sectionHeadingOnDark">{banner.title}</Text>}
        {banner.description && (
          <Text variant="bodySmall" tone="inverseMuted" numberOfLines={3}>
            {banner.description}
          </Text>
        )}
        <Button
          label="Shop now"
          variant="light"
          size="sm"
          onPress={() => router.push('/(customer)/(tabs)/explore')}
          style={styles.cta}
        />
      </FrostedCard>
    </FullBleedBanner>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing[2] },
  cta: { alignSelf: 'flex-start', marginTop: Spacing[2] },
});

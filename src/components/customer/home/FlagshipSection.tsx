import { StyleSheet, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import type { StoreSection } from '@/types/homepage.types';
import { Spacing } from '@/theme/spacing';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import { FullBleedBanner } from '../layout/FullBleedBanner';

interface Props {
  store: StoreSection | null;
}

export function FlagshipSection({ store }: Props) {
  const { width } = useWindowDimensions();
  if (!store?.imageUrl && !store?.title) return null;

  return (
    <FullBleedBanner
      imageUrl={store.imageUrl}
      height={Math.round(width * 0.8)}
      overlay="heavy"
      align="center"
    >
      {store.title && (
        <Text variant="sectionHeadingOnDark" style={styles.center}>
          {store.title}
        </Text>
      )}
      {store.description && (
        <Text variant="bodySmall" tone="inverseMuted" style={styles.center}>
          {store.description}
        </Text>
      )}
      <Button
        label="Visit now"
        variant="light"
        onPress={() => router.push('/(customer)/contact')}
        style={styles.cta}
      />
    </FullBleedBanner>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  cta: { marginTop: Spacing[4] },
});

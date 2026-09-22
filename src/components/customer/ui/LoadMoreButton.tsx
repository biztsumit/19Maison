import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Button } from './Button';

interface Props {
  onPress: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  label?: string;
}

export function LoadMoreButton({
  onPress,
  isLoading = false,
  hasMore = true,
  label = 'Load More',
}: Props) {
  if (!hasMore) return null;
  return (
    <View style={styles.wrap}>
      <Button
        label={label}
        onPress={onPress}
        loading={isLoading}
        variant="outline"
        rightIcon="refresh"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: Spacing[6] },
  button: { minWidth: 200 },
});

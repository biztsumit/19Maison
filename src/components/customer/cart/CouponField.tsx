import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Props {
  onApply: (code: string) => void;
  isApplying?: boolean;
}

export function CouponField({ onApply, isApplying = false }: Props) {
  const [code, setCode] = useState('');

  return (
    <View style={styles.row}>
      <Input
        value={code}
        onChangeText={setCode}
        placeholder="Enter coupon code"
        autoCapitalize="characters"
        returnKeyType="done"
        onSubmitEditing={() => code.trim() && onApply(code.trim())}
        containerStyle={styles.grow}
      />
      <Button
        label="Apply"
        variant="solid"
        onPress={() => code.trim() && onApply(code.trim())}
        loading={isApplying}
        disabled={!code.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3] },
  grow: { flex: 1 },
});

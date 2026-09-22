import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { couponSchema } from '@/utils/validators';
import type { CouponSchema } from '@/utils/validators';
import { ControlledInput } from '../form/ControlledInput';
import { Button } from '../ui/Button';

interface Props {
  onApply: (code: string) => void;
  isApplying?: boolean;
}

export function CouponField({ onApply, isApplying = false }: Props) {
  const { control, handleSubmit } = useForm<CouponSchema>({
    resolver: zodResolver(couponSchema),
    // Not 'onTouched': tabbing out of an empty coupon box is not a mistake worth
    // flagging — this field is optional on the cart.
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { code: '' },
  });

  const submit = ({ code }: CouponSchema) => onApply(code.trim().toUpperCase());

  return (
    <View style={styles.row}>
      <ControlledInput
        control={control}
        name="code"
        placeholder="Enter coupon code"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={24}
        returnKeyType="done"
        onSubmitEditing={handleSubmit(submit)}
        containerStyle={styles.grow}
      />
      <Button label="Apply" variant="solid" onPress={handleSubmit(submit)} loading={isApplying} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3] },
  grow: { flex: 1 },
});

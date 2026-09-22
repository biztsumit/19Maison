import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import type { Address, AddressRequest } from '@/types/user.types';
import { toE164Phone, toNationalPhone } from '@/utils/phone';
import { addressSchema } from '@/utils/validators';
import type { AddressSchema } from '@/utils/validators';
import { ControlledInput, ControlledPhoneInput } from '../form/ControlledInput';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';

interface Props {
  initial?: Address;
  onSubmit: (data: AddressRequest) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const EMPTY: AddressSchema = {
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  isDefault: false,
};

export function DeliveryAddressForm({
  initial,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save address',
}: Props) {
  const { control, handleSubmit } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    // Validate once a field has been visited, then live — so a shopper is corrected
    // as they fix a field rather than only when they press Save.
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: initial
      ? {
          ...EMPTY,
          ...initial,
          phone: toNationalPhone(initial.phone),
          isDefault: initial.isDefault,
        }
      : EMPTY,
  });

  const submit = (data: AddressSchema) =>
    onSubmit({
      ...data,
      // The API stores E.164; the form holds the national number.
      phone: toE164Phone(data.phone),
      apartment: data.apartment?.trim() || undefined,
    });

  return (
    <View style={styles.form}>
      <View style={styles.row}>
        <ControlledInput
          control={control}
          name="firstName"
          label="First name"
          required
          autoComplete="given-name"
          containerStyle={styles.grow}
        />
        <ControlledInput
          control={control}
          name="lastName"
          label="Last name"
          required
          autoComplete="family-name"
          containerStyle={styles.grow}
        />
      </View>

      <ControlledInput
        control={control}
        name="address"
        label="Address"
        required
        autoComplete="street-address"
      />

      <ControlledInput control={control} name="apartment" label="Apartment, suite (optional)" />

      <View style={styles.row}>
        <ControlledInput
          control={control}
          name="city"
          label="City"
          required
          containerStyle={styles.grow}
        />
        <ControlledInput
          control={control}
          name="state"
          label="State"
          required
          containerStyle={styles.grow}
        />
      </View>

      <View style={styles.row}>
        <ControlledInput
          control={control}
          name="pincode"
          label="PIN code"
          required
          keyboardType="number-pad"
          maxLength={6}
          containerStyle={styles.grow}
        />
        <ControlledInput
          control={control}
          name="country"
          label="Country"
          containerStyle={styles.grow}
        />
      </View>

      <ControlledPhoneInput control={control} name="phone" label="Phone" required />

      <Controller
        control={control}
        name="isDefault"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={Boolean(value)}
            onToggle={() => onChange(!value)}
            label="Use as my default address"
          />
        )}
      />

      <Button label={submitLabel} onPress={handleSubmit(submit)} loading={isSubmitting} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing[4] },
  row: { flexDirection: 'row', gap: Spacing[3] },
  grow: { flex: 1 },
});

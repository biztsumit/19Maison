import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import type { Address, AddressRequest } from '@/types/user.types';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Input } from '../ui/Input';

interface Props {
  initial?: Address;
  onSubmit: (data: AddressRequest) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

type FormState = Omit<AddressRequest, 'isDefault'> & { isDefault: boolean };

const EMPTY: FormState = {
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

type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (form.firstName.trim().length < 2) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (!/^\+?\d{10,15}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number';
  if (form.address.trim().length < 5) errors.address = 'Address is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.state.trim()) errors.state = 'State is required';
  if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = 'Enter a valid 6-digit pincode';
  return errors;
}

export function DeliveryAddressForm({
  initial,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save address',
}: Props) {
  const [form, setForm] = useState<FormState>(() =>
    initial ? { ...EMPTY, ...initial, isDefault: initial.isDefault } : EMPTY,
  );
  const [errors, setErrors] = useState<Errors>({});

  const setField = (key: keyof FormState) => (value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({ ...form, apartment: form.apartment?.trim() || undefined });
  };

  return (
    <View style={styles.form}>
      <View style={styles.row}>
        <Input
          label="First name"
          required
          value={form.firstName}
          onChangeText={setField('firstName')}
          error={errors.firstName}
          containerStyle={styles.grow}
        />
        <Input
          label="Last name"
          required
          value={form.lastName}
          onChangeText={setField('lastName')}
          error={errors.lastName}
          containerStyle={styles.grow}
        />
      </View>

      <Input
        label="Address"
        required
        value={form.address}
        onChangeText={setField('address')}
        error={errors.address}
      />

      <Input
        label="Apartment, suite (optional)"
        value={form.apartment ?? ''}
        onChangeText={setField('apartment')}
      />

      <View style={styles.row}>
        <Input
          label="City"
          required
          value={form.city}
          onChangeText={setField('city')}
          error={errors.city}
          containerStyle={styles.grow}
        />
        <Input
          label="State"
          required
          value={form.state}
          onChangeText={setField('state')}
          error={errors.state}
          containerStyle={styles.grow}
        />
      </View>

      <View style={styles.row}>
        <Input
          label="PIN code"
          required
          value={form.pincode}
          onChangeText={setField('pincode')}
          error={errors.pincode}
          keyboardType="number-pad"
          containerStyle={styles.grow}
        />
        <Input
          label="Country"
          value={form.country}
          onChangeText={setField('country')}
          containerStyle={styles.grow}
        />
      </View>

      <Input
        label="Phone"
        required
        value={form.phone}
        onChangeText={setField('phone')}
        error={errors.phone}
        keyboardType="phone-pad"
      />

      <Checkbox
        checked={form.isDefault}
        onToggle={() => setForm(prev => ({ ...prev, isDefault: !prev.isDefault }))}
        label="Use as my default address"
      />

      <Button label={submitLabel} onPress={handleSubmit} loading={isSubmitting} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing[4] },
  row: { flexDirection: 'row', gap: Spacing[3] },
  grow: { flex: 1 },
});

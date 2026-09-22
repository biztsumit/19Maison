import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { Input } from '../ui/Input';
import { PhoneInput } from '../ui/PhoneInput';

interface BaseProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

type InputProps<T extends FieldValues> = BaseProps<T> &
  Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'>;

// react-hook-form keeps the value; these just wire `onBlur`/`onChange` and surface
// `fieldState.error` so no screen can render a field that validates silently.
export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  required,
  containerStyle,
  ...rest
}: InputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          label={label}
          required={required}
          containerStyle={containerStyle}
          value={(value as string | undefined) ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...rest}
        />
      )}
    />
  );
}

type PhoneProps<T extends FieldValues> = BaseProps<T> &
  Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'>;

/** The field holds the 10-digit national number — convert with `toE164Phone` on submit. */
export function ControlledPhoneInput<T extends FieldValues>({
  control,
  name,
  label,
  required,
  containerStyle,
  ...rest
}: PhoneProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <PhoneInput
          label={label}
          required={required}
          containerStyle={containerStyle}
          value={(value as string | undefined) ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...rest}
        />
      )}
    />
  );
}

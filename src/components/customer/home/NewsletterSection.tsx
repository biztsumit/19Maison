import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { newsletterSchema } from '@/utils/validators';
import type { NewsletterSchema } from '@/utils/validators';
import { ControlledInput } from '../form/ControlledInput';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import { Section } from '../layout/Section';

interface Props {
  onSubscribe: (email: string) => Promise<void>;
}

export function NewsletterSection({ onSubscribe }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewsletterSchema>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
  });

  const submit = async ({ email }: NewsletterSchema) => {
    await onSubscribe(email.trim());
    reset();
  };

  return (
    <Section background="dark">
      <Text variant="eyebrow">Sign up for updates</Text>
      <Text variant="sectionHeadingOnDark">Be first to see new arrivals</Text>
      <Text variant="bodySmall" tone="inverseMuted">
        Occasional notes on new drops, private viewings and boutique events.
      </Text>

      {/* Stacked rather than inline: an input beside a button is too cramped at phone width. */}
      <View style={styles.form}>
        <ControlledInput
          control={control}
          name="email"
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="go"
          onSubmitEditing={handleSubmit(submit)}
        />
        <Button label="Subscribe" onPress={handleSubmit(submit)} loading={isSubmitting} fullWidth />
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing[3], marginTop: Spacing[2] },
});

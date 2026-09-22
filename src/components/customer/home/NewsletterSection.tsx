import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Text } from '../ui/Text';
import { Section } from '../layout/Section';

interface Props {
  onSubscribe: (email: string) => Promise<void>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSection({ onSubscribe }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address');
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      await onSubscribe(email.trim());
      setEmail('');
    } finally {
      setSubmitting(false);
    }
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
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={error}
        />
        <Button label="Subscribe" onPress={handleSubmit} loading={submitting} fullWidth />
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing[3], marginTop: Spacing[2] },
});

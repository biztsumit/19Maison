import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import { Text } from './Text';
import { useThemeColors } from '@/theme/theme-provider';

interface Props {
  value: string;
  label?: string;
  size?: number;
}

export function CopyButton({ value, label, size = 18 }: Props) {
  const colors = useThemeColors();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Pressable
      onPress={handleCopy}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={copied ? 'Copied' : 'Copy'}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Icon
        name={copied ? 'check' : 'copy'}
        size={size}
        color={copied ? colors.success : colors.textMuted}
      />
      {label && <Text variant="bodySmallMuted">{copied ? 'Copied' : label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[1.5] },
  pressed: { opacity: 0.6 },
});

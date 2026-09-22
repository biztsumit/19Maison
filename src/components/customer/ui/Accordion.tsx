import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import type { ReactNode } from 'react';
import { Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  bordered?: boolean;
}

export function Accordion({
  label,
  children,
  defaultOpen = false,
  isOpen,
  onToggle,
  bordered = true,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = isOpen !== undefined;
  const open = controlled ? isOpen : internalOpen;

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (controlled) onToggle?.();
    else setInternalOpen(prev => !prev);
  };

  return (
    <View style={bordered && styles.bordered}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={styles.header}
      >
        <Text variant="cardTitle" style={styles.label}>
          {label}
        </Text>
        <Icon name={open ? 'minus' : 'plus'} size={18} color={colors.text} />
      </Pressable>
      {open && <View style={styles.body}>{children}</View>}
    </View>
  );
}

interface GroupItem {
  key: string;
  label: string;
  content: ReactNode;
}

interface GroupProps {
  items: GroupItem[];
  singleOpen?: boolean;
  defaultOpenKey?: string;
}

export function AccordionGroup({ items, singleOpen = true, defaultOpenKey }: GroupProps) {
  const [openKey, setOpenKey] = useState<string | null>(defaultOpenKey ?? null);

  if (!singleOpen) {
    return (
      <View>
        {items.map(item => (
          <Accordion key={item.key} label={item.label} defaultOpen={item.key === defaultOpenKey}>
            {item.content}
          </Accordion>
        ))}
      </View>
    );
  }

  return (
    <View>
      {items.map(item => (
        <Accordion
          key={item.key}
          label={item.label}
          isOpen={openKey === item.key}
          onToggle={() => setOpenKey(prev => (prev === item.key ? null : item.key))}
        >
          {item.content}
        </Accordion>
      ))}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    bordered: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 58,
      paddingVertical: Spacing[3],
      gap: Spacing[3],
    },
    label: { flex: 1 },
    body: { paddingBottom: Spacing[4] },
  });

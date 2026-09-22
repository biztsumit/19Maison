import { StyleSheet, View } from 'react-native';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

export interface TimelineStep {
  key: string;
  label: string;
  description?: string;
  timestamp?: string;
  status: 'done' | 'current' | 'pending';
}

interface Props {
  steps: TimelineStep[];
}

export function Timeline({ steps }: Props) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const reached = step.status !== 'pending';

        return (
          <View key={step.key} style={styles.row}>
            <View style={styles.gutter}>
              <View style={[styles.dot, reached ? styles.dotDone : styles.dotPending]} />
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    reached ? styles.connectorDone : styles.connectorPending,
                  ]}
                />
              )}
            </View>

            <View style={[styles.content, isLast && styles.contentLast]}>
              <Text variant="cardTitle" tone={reached ? 'default' : 'muted'}>
                {step.label}
              </Text>
              {step.description && <Text variant="bodySmallMuted">{step.description}</Text>}
              {step.timestamp && <Text variant="caption">{step.timestamp}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: Spacing[3] },
    gutter: { alignItems: 'center', width: 16 },
    dot: { width: 12, height: 12, borderRadius: BorderRadius.full, marginTop: Spacing[1] },
    dotDone: { backgroundColor: c.accent },
    dotPending: {
      backgroundColor: c.bg,
      borderWidth: 1,
      borderColor: c.border,
    },
    connector: { flex: 1, width: 2, marginVertical: Spacing[1] },
    connectorDone: { backgroundColor: c.borderStrong },
    connectorPending: { backgroundColor: c.border },
    content: { flex: 1, gap: Spacing[0.5], paddingBottom: Spacing[5] },
    contentLast: { paddingBottom: 0 },
  });

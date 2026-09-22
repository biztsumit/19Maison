import { StyleSheet, View } from 'react-native';
import { CustomerColors } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Text } from './Text';

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

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing[3] },
  gutter: { alignItems: 'center', width: 16 },
  dot: { width: 12, height: 12, borderRadius: BorderRadius.full, marginTop: Spacing[1] },
  dotDone: { backgroundColor: CustomerColors.accent },
  dotPending: {
    backgroundColor: CustomerColors.bg,
    borderWidth: 1,
    borderColor: CustomerColors.border,
  },
  connector: { flex: 1, width: 2, marginVertical: Spacing[1] },
  connectorDone: { backgroundColor: CustomerColors.bgDark },
  connectorPending: { backgroundColor: CustomerColors.border },
  content: { flex: 1, gap: Spacing[0.5], paddingBottom: Spacing[5] },
  contentLast: { paddingBottom: 0 },
});

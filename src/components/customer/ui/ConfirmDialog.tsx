import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Pressable, Modal as RNModal, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { Text } from './Text';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  // Tints the primary action for deletions and cancellations.
  destructive?: boolean;
  // One button, nothing to decide — the replacement for a bare Alert.alert(title, body).
  variant?: 'confirm' | 'alert';
}

interface Props extends ConfirmOptions {
  visible: boolean;
  onResolve: (confirmed: boolean) => void;
}

// Buttons sit side by side until a label is long enough to risk clipping. Button
// has a fixed height and does not wrap, so an overflowing label is silently cut.
// A split row leaves roughly 130pt of text space per button, which at the uppercase
// CTA size is about 14 characters.
const MAX_INLINE_LABEL = 14;

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  variant = 'confirm',
  onResolve,
}: Props) {
  const isAlert = variant === 'alert';
  const primaryLabel = confirmLabel ?? (isAlert ? 'OK' : 'Confirm');
  const stacked =
    !isAlert && (primaryLabel.length > MAX_INLINE_LABEL || cancelLabel.length > MAX_INLINE_LABEL);

  const confirmButton = (
    <Button
      label={primaryLabel}
      variant={destructive ? 'danger' : 'solid'}
      onPress={() => onResolve(true)}
      style={stacked ? undefined : styles.action}
      fullWidth={stacked}
    />
  );

  const cancelButton = !isAlert && (
    <Button
      label={cancelLabel}
      variant="outline"
      onPress={() => onResolve(false)}
      style={stacked ? undefined : styles.action}
      fullWidth={stacked}
    />
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      // Android back dismisses as a cancel, matching what Alert does.
      onRequestClose={() => onResolve(false)}
    >
      <View style={styles.root}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => onResolve(false)}
          accessibilityLabel="Dismiss"
        />

        <View style={styles.panel}>
          {/* Scrolls rather than growing, so a long message can never push the
              buttons off the bottom of the screen. */}
          <ScrollView
            style={styles.bodyScroll}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text variant="sectionHeading" style={styles.centered}>
              {title}
            </Text>
            {Boolean(message) && (
              <Text variant="bodyMuted" style={styles.centered}>
                {message}
              </Text>
            )}
          </ScrollView>

          <View style={stacked ? styles.actionsStacked : styles.actions}>
            {/* Stacked puts the decision on top and the way out underneath, the
                order both platforms use for vertical alert buttons. */}
            {stacked ? (
              <>
                {confirmButton}
                {cancelButton}
              </>
            ) : (
              <>
                {cancelButton}
                {confirmButton}
              </>
            )}
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CustomerColors.overlayMedium,
    paddingHorizontal: CustomerLayout.screenPaddingH,
  },
  panel: {
    width: '100%',
    maxWidth: 400,
    // Keeps the dialog well short of the screen edges on a long message.
    maxHeight: '80%',
    backgroundColor: CustomerColors.bg,
  },
  // flexGrow: 0 lets the panel hug short content and only scroll once it is tall.
  bodyScroll: { flexGrow: 0 },
  body: {
    alignItems: 'center',
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingTop: Spacing[7],
    paddingBottom: Spacing[5],
    gap: Spacing[2],
  },
  // Centred on every line, so a message that wraps stays balanced rather than
  // ragging out to the right. Deliberately no lineHeight override: the bodyMuted
  // preset already carries a relaxed 23.1, and the previous hardcoded 20 tightened
  // it — the wrong direction for text that wraps.
  centered: { textAlign: 'center' },
  actions: {
    flexDirection: 'row',
    gap: Spacing[3],
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingBottom: CustomerLayout.screenPaddingH,
  },
  actionsStacked: {
    gap: Spacing[2],
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingBottom: CustomerLayout.screenPaddingH,
  },
  action: { flex: 1 },
});

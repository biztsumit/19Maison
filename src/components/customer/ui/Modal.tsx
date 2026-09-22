import { Modal as RNModal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  variant?: 'center' | 'fullscreen';
  footer?: ReactNode;
  children: ReactNode;
}

export function Modal({ visible, onClose, title, variant = 'center', footer, children }: Props) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const fullscreen = variant === 'fullscreen';

  return (
    <RNModal
      visible={visible}
      transparent={!fullscreen}
      animationType={fullscreen ? 'slide' : 'fade'}
      onRequestClose={onClose}
      presentationStyle={fullscreen ? 'pageSheet' : 'overFullScreen'}
    >
      <View
        style={[
          fullscreen ? styles.fullRoot : styles.centerRoot,
          fullscreen && { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {!fullscreen && (
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        )}

        <View style={fullscreen ? styles.fullPanel : styles.centerPanel}>
          {title && (
            <View style={styles.header}>
              <Text variant="sectionHeading">{title}</Text>
              <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close">
                <Icon name="close" size={22} />
              </Pressable>
            </View>
          )}

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>

          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </View>
    </RNModal>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    centerRoot: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.overlayMedium,
      paddingHorizontal: CustomerLayout.screenPaddingH,
    },
    fullRoot: { flex: 1, backgroundColor: c.bg },
    centerPanel: {
      width: '100%',
      maxHeight: '80%',
      backgroundColor: c.bgElevated,
    },
    fullPanel: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[4],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    body: { flexGrow: 0 },
    bodyContent: { padding: CustomerLayout.screenPaddingH },
    footer: {
      flexDirection: 'row',
      gap: Spacing[3],
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      padding: CustomerLayout.screenPaddingH,
    },
  });

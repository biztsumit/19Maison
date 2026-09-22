import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomerLayout } from '@/theme/customer';
import { BorderRadius, Spacing } from '@/theme/spacing';
import { Icon } from './Icon';
import { Text } from './Text';
import type { CustomerPalette } from '@/theme/palette';
import { useThemedStyles } from '@/theme/theme-provider';

export type SheetSnap = 'content' | 'large' | 'full';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  snap?: SheetSnap;
  footer?: ReactNode;
  children: ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SNAP_HEIGHT: Record<SheetSnap, number | undefined> = {
  content: undefined,
  large: SCREEN_HEIGHT * 0.7,
  full: SCREEN_HEIGHT * 0.92,
};

// The web reference uses side drawers for this; on a phone a bottom sheet is the
// native equivalent. Built on RN primitives rather than adding a sheet dependency.
export function BottomSheet({
  visible,
  onClose,
  title,
  snap = 'content',
  footer,
  children,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_HEIGHT);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 2 }),
        Animated.timing(backdrop, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, translateY, backdrop]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 0.8) {
          dismiss();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 2 }).start();
        }
      },
    }),
  ).current;

  const height = SNAP_HEIGHT[snap];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={dismiss}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityLabel="Close" />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            height ? { height } : { maxHeight: SCREEN_HEIGHT * 0.9 },
            { paddingBottom: insets.bottom, transform: [{ translateY }] },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.grabArea}>
            <View style={styles.handle} />
            {title && (
              <View style={styles.header}>
                <Text variant="sectionHeading">{title}</Text>
                <Pressable onPress={dismiss} hitSlop={10} accessibilityLabel="Close">
                  <Icon name="close" size={22} />
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.body}>{children}</View>

          {footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </View>
    </Modal>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    root: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFill, backgroundColor: c.overlayMedium },
    sheet: {
      backgroundColor: c.bgElevated,
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      overflow: 'hidden',
    },
    grabArea: { paddingTop: Spacing[2.5] },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: BorderRadius.full,
      backgroundColor: c.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingVertical: Spacing[4],
    },
    body: { flexShrink: 1 },
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      paddingHorizontal: CustomerLayout.screenPaddingH,
      paddingTop: Spacing[3],
    },
  });

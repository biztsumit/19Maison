import { useRef } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';
import { ImageCarousel } from '../ui/ImageCarousel';
import type { CustomerPalette } from '@/theme/palette';
import { useThemeColors, useThemedStyles } from '@/theme/theme-provider';

interface Props {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

// Swipe between images and swipe down to dismiss. The web shows prev/next arrows
// and a thumbnail strip in here; both are redundant once swiping works.
export function ImageLightbox({ visible, images, onClose }: Props) {
  const styles = useThemedStyles(makeStyles);
  const colors = useThemeColors();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      // Only claim clearly-vertical drags, so horizontal paging still works.
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > 12 && Math.abs(g.dy) > Math.abs(g.dx) * 1.5,
      onPanResponderMove: (_, g) => translateY.setValue(g.dy),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dy) > 120) {
          onClose();
          translateY.setValue(0);
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <Animated.View
        style={[styles.root, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <ImageCarousel
          images={images}
          width={width}
          height={height}
          contentFit="contain"
          showCounter
        />

        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityLabel="Close"
          style={[styles.close, { top: insets.top + Spacing[3] }]}
        >
          <Icon name="close" size={26} color={colors.textInverse} />
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const makeStyles = (c: CustomerPalette) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgDark, justifyContent: 'center' },
    close: { position: 'absolute', right: Spacing[5] },
  });

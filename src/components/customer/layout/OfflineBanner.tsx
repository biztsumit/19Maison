import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';

// Without this, losing signal mid-browse just produced failed requests and empty
// states, which reads as "the shop is broken" rather than "you are offline".
export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const [offline, setOffline] = useState(false);
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return NetInfo.addEventListener(state => {
      // isInternetReachable is null while the check is still pending — treating
      // that as offline would flash the banner on every cold start.
      const reachable = state.isInternetReachable ?? state.isConnected ?? true;
      setOffline(!reachable);
    });
  }, []);

  useEffect(() => {
    Animated.timing(slide, {
      toValue: offline ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [offline, slide]);

  const height = insets.top + 34;
  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [-height, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[styles.bar, { height, paddingTop: insets.top, transform: [{ translateY }] }]}
    >
      <Icon name="alert" size={14} color={CustomerColors.textInverse} />
      <Text variant="caption" tone="inverse">
        No internet connection
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingHorizontal: CustomerLayout.screenPaddingH,
    backgroundColor: CustomerColors.bgDark,
  },
});

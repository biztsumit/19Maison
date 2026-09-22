import { useEffect } from 'react';
import { useNavigation } from 'expo-router';

/**
 * Runs `reset` when the user taps this screen's tab in the tab bar.
 *
 * React Navigation 7 removed `unmountOnBlur`, so tab screens stay mounted and keep
 * their state. `tabPress` is the right signal rather than focus: it fires when the
 * user deliberately returns via the tab bar, but NOT when focus returns from a
 * pushed screen (product detail, checkout), where losing filters would be wrong.
 */
export function useResetOnTabPress(reset: () => void) {
  const navigation = useNavigation();

  useEffect(() => {
    // `tabPress` is contributed by the bottom-tab navigator, so it is absent from
    // the base navigation event map.
    const nav = navigation as unknown as {
      addListener: (event: string, cb: () => void) => () => void;
    };
    return nav.addListener('tabPress', reset);
  }, [navigation, reset]);
}

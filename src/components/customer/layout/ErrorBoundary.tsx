import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomerColors, CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';

interface Props {
  children: ReactNode;
  // Called before re-rendering the tree, to drop whatever state caused the throw.
  onReset?: () => void;
}

interface State {
  error: Error | null;
}

// A render error anywhere below this point otherwise unmounts the whole tree and
// leaves a blank screen in production (the redbox is development only). A shopper
// hitting that has no way back other than force-quitting.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Nothing is wired to a crash reporter yet; until then this at least survives
    // in the device log.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.body}>
          <Icon name="alert" size={40} color={CustomerColors.textMuted} />
          <Text variant="screenTitle" style={styles.center}>
            Something went wrong
          </Text>
          <Text variant="bodyMuted" style={styles.center}>
            The app ran into an unexpected problem. You can try again from here.
          </Text>
          {__DEV__ && (
            <Text variant="caption" style={styles.center} numberOfLines={6}>
              {error.message}
            </Text>
          )}
          <Button label="Try again" onPress={this.handleReset} style={styles.action} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CustomerColors.bg },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    paddingHorizontal: CustomerLayout.screenPaddingH,
  },
  center: { textAlign: 'center' },
  action: { marginTop: Spacing[4], minWidth: 200 },
});

import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/theme/colors';
import { Spacing, Layout } from '@/theme/spacing';
import { Text } from './Text';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  transparent?: boolean;
}

export function Header({ title, showBack = false, rightElement, transparent = false }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        transparent && styles.transparent,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
              <Text variant="titleMedium" color="primary">←</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.center}>
          {title && (
            <Text variant="label" color="primary" style={styles.title}>
              {title}
            </Text>
          )}
        </View>

        <View style={styles.right}>{rightElement}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transparent: {
    backgroundColor: Colors.transparent,
    borderBottomColor: Colors.transparent,
  },
  content: {
    height: Layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backBtn: {
    padding: Spacing[1],
  },
  title: {
    letterSpacing: 3,
  },
});

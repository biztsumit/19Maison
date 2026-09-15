import { useAuth } from '@/hooks/useAuth';
import { Font, FontSize } from '@/theme/typography';
import { Text } from '@/components/common/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_ORDERS = [
  { id: '1', brand: 'GUCCI', model: 'GG1941S-001' },
  { id: '2', brand: 'GUCCI', model: 'GG1941S-001' },
  { id: '3', brand: 'GUCCI', model: 'GG1941S-001' },
  { id: '4', brand: 'GUCCI', model: 'GG1941S-001' },
  { id: '5', brand: 'GUCCI', model: 'GG1941S-001' },
  { id: '6', brand: 'GUCCI', model: 'GG1941S-001' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { displayName, user, logout } = useAuth();

  const subtitle = user?.phone ?? 'Employee';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 50 },
        ]}
      >
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Staff Info Card */}
        <View style={styles.staffCard}>
          <Text style={styles.staffName}>{displayName ?? 'Staff Member'}</Text>
          <Text style={styles.staffSubtitle}>{subtitle}</Text>
        </View>

        {/* Orders Details Section */}
        <View style={styles.ordersSection}>
          <Text style={styles.sectionHeading}>Orders Details</Text>

          {MOCK_ORDERS.map((order, index) => (
            <View
              key={order.id}
              style={[
                styles.orderRow,
                index === MOCK_ORDERS.length - 1 && styles.orderRowLast,
              ]}
            >
              {/* Thumbnail */}
              <LinearGradient
                colors={['#2A2A2A', '#1A1A1A']}
                style={styles.thumbnail}
              />

              {/* Info */}
              <View style={styles.orderInfo}>
                <Text style={styles.orderBrand}>{order.brand}</Text>
                <Text style={styles.orderModel}>{order.model}</Text>
              </View>

              {/* Eye icon */}
              <TouchableOpacity
                onPress={() => router.push('/(staff)/product/mock-order-id')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.eyeIcon}>👁</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
  },
  headerTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize['2xl'],
    color: '#000000',
    lineHeight: undefined,
  },

  // ScrollView content
  scrollContent: {
    paddingLeft: 40,
    paddingRight: 8,
    paddingTop: 24,
    gap: 24,
    paddingBottom: 40,
  },

  // Staff card
  staffCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    alignItems: 'center',
  },
  staffName: {
    fontFamily: Font.medium,
    fontSize: 30,
    lineHeight: 30 * 1.3,
    color: '#000000',
    textAlign: 'center',
  },
  staffSubtitle: {
    fontFamily: Font.regular,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.3,
    color: '#626262',
    textAlign: 'center',
  },

  // Orders section
  ordersSection: {
    borderWidth: 1,
    borderColor: 'rgba(221,221,221,0.87)',
    borderRadius: 8,
    padding: 24,
  },
  sectionHeading: {
    fontFamily: Font.medium,
    fontSize: FontSize['2xl'],
    color: '#000000',
    marginBottom: 16,
  },

  // Order row
  orderRow: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(221,221,221,0.87)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  orderRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  thumbnail: {
    width: 80,
    height: 48,
    borderRadius: 4,
  },
  orderInfo: {
    flex: 1,
    gap: 6,
  },
  orderBrand: {
    fontFamily: Font.semibold,
    fontSize: FontSize.base,
    color: '#000000',
  },
  orderModel: {
    fontFamily: Font.regular,
    fontSize: FontSize['2xl'],
    color: '#000000',
  },
  eyeIcon: {
    fontSize: 20,
    color: '#626262',
  },

  // Logout button
  logoutButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 56,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

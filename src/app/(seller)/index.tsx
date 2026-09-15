import { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchSellerProfileThunk, fetchSellerAnalyticsThunk } from '@/store/slices/seller.slice';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { Divider } from '@/components/common/Divider';
import { formatPrice } from '@/utils/formatters';

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <View style={[styles.statCard, accent && styles.statCardAccent]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text variant="displaySmall" color={accent ? 'primary' : 'gold'} style={styles.statValue}>
        {value}
      </Text>
      <Text variant="label" color="muted" style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

export default function SellerDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { profile, analytics, isLoading } = useAppSelector(state => state.seller);

  useEffect(() => {
    dispatch(fetchSellerProfileThunk());
    dispatch(fetchSellerAnalyticsThunk('month'));
  }, [dispatch]);

  const store = profile?.store;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="caption" color="muted">
              Welcome back,
            </Text>
            <Text variant="headingSmall" color="primary">
              {user?.firstName}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => router.push('/(seller)/settings')}
            >
              <Text style={styles.notifIcon}>◈</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Store Banner */}
          <LinearGradient
            colors={[Colors.surface, Colors.surfaceElevated, Colors.surface]}
            style={styles.storeBanner}
          >
            <View style={styles.storeInfo}>
              <View style={styles.storeAvatar}>
                <Text style={styles.storeAvatarText}>
                  {store?.name?.charAt(0)?.toUpperCase() ?? 'S'}
                </Text>
              </View>
              <View style={styles.storeDetails}>
                {isLoading ? (
                  <>
                    <Skeleton height={16} width={120} />
                    <Skeleton height={12} width={80} />
                  </>
                ) : (
                  <>
                    <Text variant="headingSmall" color="primary">
                      {store?.name ?? 'Your Store'}
                    </Text>
                    <View style={styles.verifiedRow}>
                      {store?.isVerified && (
                        <Text variant="caption" color="gold">
                          ✓ Verified Seller
                        </Text>
                      )}
                      <Text variant="caption" color="muted">
                        ★ {store?.rating?.toFixed(1) ?? '0.0'}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </LinearGradient>

          {/* Quick Stats */}
          <View style={styles.statsGrid}>
            {isLoading ? (
              Array(4)
                .fill(null)
                .map((_, i) => (
                  <View key={i} style={styles.statCard}>
                    <Skeleton height={32} width={80} />
                    <Skeleton height={10} width={60} />
                  </View>
                ))
            ) : (
              <>
                <StatCard
                  label="REVENUE"
                  value={formatPrice(analytics?.totalRevenue ?? 0)}
                  icon="₹"
                  accent
                />
                <StatCard
                  label="ORDERS"
                  value={String(analytics?.totalOrders ?? 0)}
                  icon="◻"
                />
                <StatCard
                  label="PRODUCTS"
                  value={String(store?.totalProducts ?? 0)}
                  icon="⊞"
                />
                <StatCard
                  label="AVG. ORDER"
                  value={formatPrice(analytics?.averageOrderValue ?? 0)}
                  icon="⌖"
                />
              </>
            )}
          </View>

          <Divider />

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text variant="label" color="secondary" style={styles.sectionTitle}>
              QUICK ACTIONS
            </Text>
            <View style={styles.actionsGrid}>
              {[
                {
                  icon: '⊕',
                  label: 'Add Product',
                  onPress: () => router.push('/(seller)/products/add'),
                },
                {
                  icon: '◻',
                  label: 'View Orders',
                  onPress: () => router.push('/(seller)/orders'),
                },
                {
                  icon: '⊞',
                  label: 'Products',
                  onPress: () => router.push('/(seller)/products'),
                },
                {
                  icon: '⌖',
                  label: 'Analytics',
                  onPress: () => router.push('/(seller)/analytics'),
                },
              ].map(action => (
                <TouchableOpacity
                  key={action.label}
                  style={styles.actionCard}
                  onPress={action.onPress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text variant="label" color="secondary">
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider />

          {/* Top Products */}
          {(analytics?.topProducts?.length ?? 0) > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="label" color="secondary" style={styles.sectionTitle}>
                  TOP PRODUCTS
                </Text>
                <TouchableOpacity onPress={() => router.push('/(seller)/products')}>
                  <Text variant="label" color="gold">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              {analytics!.topProducts.slice(0, 3).map((p, i) => (
                <View key={p.productId} style={styles.topProductRow}>
                  <Text variant="label" color="muted" style={styles.rank}>
                    {i + 1}
                  </Text>
                  <View style={styles.topProductInfo}>
                    <Text variant="titleMedium" color="primary" numberOfLines={1}>
                      {p.productName}
                    </Text>
                    <Text variant="caption" color="muted">
                      {p.totalSales} sales
                    </Text>
                  </View>
                  <Text variant="price" color="gold">
                    {formatPrice(p.revenue)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Earnings Card */}
          <View style={styles.earningsCard}>
            <LinearGradient
              colors={[Colors.goldDark, Colors.gold, Colors.goldLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.earningsGradient}
            >
              <Text variant="label" color="primary" style={styles.earningsLabel}>
                PENDING EARNINGS
              </Text>
              <Text variant="displaySmall" color="primary">
                {formatPrice(profile?.pendingEarnings ?? 0)}
              </Text>
              <Text variant="bodySmall" color="primary" style={{ opacity: 0.8 }}>
                Total withdrawn: {formatPrice(profile?.withdrawnEarnings ?? 0)}
              </Text>
              <Button
                label="Withdraw"
                variant="secondary"
                size="sm"
                onPress={() => {}}
                style={styles.withdrawBtn}
              />
            </LinearGradient>
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerActions: { flexDirection: 'row', gap: Spacing[3] },
  notifBtn: { padding: Spacing[1] },
  notifIcon: { fontSize: 22, color: Colors.textPrimary },
  scroll: { paddingBottom: Spacing[6] },

  // Store banner
  storeBanner: {
    padding: Spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  storeInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing[4] },
  storeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeAvatarText: { fontSize: 22, fontWeight: '700', color: Colors.textInverse },
  storeDetails: { flex: 1, gap: Spacing[1] },
  verifiedRow: { flexDirection: 'row', gap: Spacing[3], alignItems: 'center' },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing[4],
    gap: Spacing[3],
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
    gap: Spacing[1],
    alignItems: 'flex-start',
  },
  statCardAccent: {
    borderColor: Colors.gold,
    backgroundColor: Colors.surfaceElevated,
  },
  statIcon: { fontSize: 18, color: Colors.gold, marginBottom: Spacing[1] },
  statValue: { fontWeight: '300', fontSize: 22, letterSpacing: -0.5 },
  statLabel: { letterSpacing: 2, fontSize: 10 },

  // Sections
  section: { padding: Spacing[4], gap: Spacing[3] },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { letterSpacing: 3 },

  // Quick actions
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[3] },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
    alignItems: 'center',
    gap: Spacing[2],
  },
  actionIcon: { fontSize: 24, color: Colors.amber },

  // Top products
  topProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  rank: { width: 20, textAlign: 'center' },
  topProductInfo: { flex: 1 },

  // Earnings
  earningsCard: {
    margin: Spacing[4],
    overflow: 'hidden',
  },
  earningsGradient: {
    padding: Spacing[5],
    gap: Spacing[2],
  },
  earningsLabel: { opacity: 0.8 },
  withdrawBtn: { alignSelf: 'flex-start', marginTop: Spacing[2] },
});

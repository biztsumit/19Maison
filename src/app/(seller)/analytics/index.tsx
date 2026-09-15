import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from '@/components/common/Text';
import { Divider } from '@/components/common/Divider';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { SellerService } from '@/api/services/seller.service';
import { formatPrice } from '@/utils/formatters';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - Spacing[4] * 2;
const CHART_HEIGHT = 160;

type Period = 'week' | 'month' | 'year';

const PERIODS: { label: string; value: Period }[] = [
  { label: '7D', value: 'week' },
  { label: '30D', value: 'month' },
  { label: '1Y', value: 'year' },
];

function BarChart({ data }: { data: { date: string; revenue: number }[] }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.revenue), 1);
  const barWidth = (CHART_WIDTH - Spacing[3] * (data.length - 1)) / data.length;

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.chart}>
        {data.map((item, i) => {
          const barHeight = (item.revenue / maxVal) * CHART_HEIGHT;
          return (
            <View key={i} style={[chartStyles.barWrapper, { width: barWidth }]}>
              <Text style={chartStyles.barValue}>{item.revenue > 0 ? formatPrice(item.revenue).replace('₹', '') : ''}</Text>
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold]}
                style={[chartStyles.bar, { height: Math.max(barHeight, 4) }]}
              />
              <Text style={chartStyles.barLabel} numberOfLines={1}>
                {item.date.slice(-2)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { paddingVertical: Spacing[4] },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 40,
    gap: Spacing[3],
  },
  barWrapper: { alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  bar: { width: '100%', minHeight: 4 },
  barValue: { fontSize: 8, color: Colors.textMuted, textAlign: 'center' },
  barLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
});

function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <View style={[styles.kpiCard, accent && styles.kpiCardAccent]}>
      <Text variant="caption" color="muted" style={styles.kpiLabel}>
        {label}
      </Text>
      <Text
        variant="headingMedium"
        color={accent ? 'gold' : 'primary'}
        style={styles.kpiValue}
      >
        {value}
      </Text>
      {sub && (
        <Text variant="caption" color="muted">
          {sub}
        </Text>
      )}
    </View>
  );
}

export default function SellerAnalyticsScreen() {
  const [period, setPeriod] = useState<Period>('month');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['seller-analytics', period],
    queryFn: () => SellerService.getAnalytics(period),
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text variant="label" style={styles.headerTitle}>
            ANALYTICS
          </Text>
          <View style={styles.periodTabs}>
            {PERIODS.map(p => (
              <TouchableOpacity
                key={p.value}
                style={[styles.periodTab, period === p.value && styles.periodTabActive]}
                onPress={() => setPeriod(p.value)}
              >
                <Text
                  variant="caption"
                  style={period === p.value ? styles.periodLabelActive : styles.periodLabel}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {isLoading ? (
            <View style={styles.section}>
              <View style={styles.kpiGrid}>
                {Array(4).fill(null).map((_, i) => (
                  <View key={i} style={styles.kpiCard}>
                    <Skeleton height={12} width={80} />
                    <Skeleton height={28} width={100} />
                  </View>
                ))}
              </View>
              <Skeleton height={CHART_HEIGHT + 40} />
            </View>
          ) : (
            <>
              {/* KPI Cards */}
              <View style={styles.section}>
                <View style={styles.kpiGrid}>
                  <KpiCard
                    label="TOTAL REVENUE"
                    value={formatPrice(analytics?.totalRevenue ?? 0)}
                    accent
                  />
                  <KpiCard
                    label="TOTAL ORDERS"
                    value={String(analytics?.totalOrders ?? 0)}
                  />
                  <KpiCard
                    label="AVG. ORDER VALUE"
                    value={formatPrice(analytics?.averageOrderValue ?? 0)}
                  />
                  <KpiCard
                    label="PRODUCTS"
                    value={String(analytics?.topProducts?.length ?? 0)}
                    sub="active listings"
                  />
                </View>
              </View>

              <Divider />

              {/* Revenue Chart */}
              <View style={styles.section}>
                <Text variant="label" color="secondary" style={styles.sectionTitle}>
                  REVENUE TREND
                </Text>
                {(analytics?.revenueByDay?.length ?? 0) > 0 ? (
                  <BarChart data={analytics!.revenueByDay} />
                ) : (
                  <View style={styles.noData}>
                    <Text variant="body" color="muted">No data for this period</Text>
                  </View>
                )}
              </View>

              <Divider />

              {/* Orders by Status */}
              {(analytics?.ordersByStatus?.length ?? 0) > 0 && (
                <View style={styles.section}>
                  <Text variant="label" color="secondary" style={styles.sectionTitle}>
                    ORDERS BY STATUS
                  </Text>
                  <View style={styles.statusList}>
                    {analytics!.ordersByStatus.map(item => {
                      const total = analytics!.ordersByStatus.reduce((s, i) => s + i.count, 0);
                      const pct = total > 0 ? (item.count / total) * 100 : 0;
                      return (
                        <View key={item.status} style={styles.statusRow}>
                          <Text
                            variant="bodySmall"
                            color="secondary"
                            style={styles.statusLabel}
                          >
                            {item.status.replace(/_/g, ' ')}
                          </Text>
                          <View style={styles.statusBarBg}>
                            <LinearGradient
                              colors={[Colors.goldDark, Colors.gold]}
                              style={[styles.statusBar, { width: `${pct}%` }]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            />
                          </View>
                          <Text variant="bodySmall" color="gold" style={styles.statusCount}>
                            {item.count}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              <Divider />

              {/* Top Products */}
              {(analytics?.topProducts?.length ?? 0) > 0 && (
                <View style={styles.section}>
                  <Text variant="label" color="secondary" style={styles.sectionTitle}>
                    TOP PERFORMING PRODUCTS
                  </Text>
                  {analytics!.topProducts.map((product, i) => (
                    <View key={product.productId} style={styles.topProductRow}>
                      <View style={styles.rankBadge}>
                        <Text variant="caption" color="gold">
                          #{i + 1}
                        </Text>
                      </View>
                      <View style={styles.topProductInfo}>
                        <Text variant="titleMedium" color="primary" numberOfLines={1}>
                          {product.productName}
                        </Text>
                        <Text variant="bodySmall" color="muted">
                          {product.totalSales} units sold
                        </Text>
                      </View>
                      <Text variant="price" color="gold">
                        {formatPrice(product.revenue)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

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
  headerTitle: { letterSpacing: 5 },
  periodTabs: { flexDirection: 'row', gap: Spacing[1] },
  periodTab: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1.5],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodTabActive: { borderColor: Colors.amber, backgroundColor: Colors.surfaceElevated },
  periodLabel: { color: Colors.textMuted },
  periodLabelActive: { color: Colors.amber },
  scroll: { paddingBottom: Spacing[6] },
  section: { padding: Spacing[4], gap: Spacing[4] },
  sectionTitle: { letterSpacing: 3 },

  // KPI
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[3] },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
    gap: Spacing[1],
  },
  kpiCardAccent: { borderColor: Colors.gold },
  kpiLabel: { letterSpacing: 2, fontSize: 9 },
  kpiValue: { fontWeight: '300' },

  // Status chart
  statusList: { gap: Spacing[3] },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  statusLabel: { width: 110, textTransform: 'capitalize' },
  statusBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surfaceHighlight,
    overflow: 'hidden',
  },
  statusBar: { height: '100%' },
  statusCount: { width: 24, textAlign: 'right' },

  // Top products
  topProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topProductInfo: { flex: 1 },

  // No data
  noData: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
});

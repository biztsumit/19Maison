import { useState } from 'react';
import { Thumbnail } from '@/components/customer/ui/Thumbnail';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { SearchInput } from '@/components/common/SearchInput';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/loaders/SkeletonLoader';
import { SellerService } from '@/api/services/seller.service';
import { formatPrice } from '@/utils/formatters';
import type { Product } from '@/types';

function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const image = product.images.find(i => i.isPrimary) ?? product.images[0];
  const totalStock = product.variants.reduce((sum, v) => sum + (v.inStock ? 1 : 0), 0);
  const isLowStock = totalStock <= 5;

  return (
    <View style={styles.productRow}>
      <Thumbnail uri={image?.url} tone="dark" style={styles.productThumb} />
      <View style={styles.productInfo}>
        <Text variant="caption" color="muted" style={styles.productBrand}>
          {product.brand.name.toUpperCase()}
        </Text>
        <Text variant="titleMedium" color="primary" numberOfLines={1}>
          {product.name}
        </Text>
        <Text variant="price" color="gold">
          {formatPrice(product.price)}
        </Text>
        <View style={styles.productMeta}>
          <View
            style={[styles.stockBadge, isLowStock ? styles.stockBadgeLow : styles.stockBadgeOk]}
          >
            <Text variant="caption" style={{ color: isLowStock ? Colors.error : Colors.success }}>
              {totalStock} in stock
            </Text>
          </View>
          {!product.isActive && (
            <View style={styles.inactiveBadge}>
              <Text variant="caption" color="muted">
                Inactive
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Text variant="caption" color="gold">
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
          <Text variant="caption" color="error">
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SellerProductsScreen() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['seller-products', search],
    queryFn: () => SellerService.getProducts({ search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SellerService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
    },
  });

  const products = data?.data ?? [];

  const confirmDelete = (product: Product) => {
    Alert.alert('Delete Product', `Remove "${product.name}" from your store?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(product.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text variant="label" style={styles.headerTitle}>
            PRODUCTS
          </Text>
          <Button
            label="+ Add"
            variant="gold"
            size="sm"
            onPress={() => router.push('/(seller)/products/add')}
          />
        </View>

        <View style={styles.searchBar}>
          <SearchInput
            placeholder="Search your products…"
            value={search}
            onChangeText={setSearch}
            onClear={() => setSearch('')}
          />
        </View>

        {isLoading ? (
          <View style={styles.skeletonList}>
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <View key={i} style={styles.productRow}>
                  <Skeleton width={72} height={88} />
                  <View style={{ flex: 1, gap: Spacing[2] }}>
                    <Skeleton height={10} width="40%" />
                    <Skeleton height={14} width="70%" />
                    <Skeleton height={14} width="30%" />
                  </View>
                </View>
              ))}
          </View>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products yet"
            subtitle="Add your first product to start selling"
            actionLabel="Add Product"
            onAction={() => router.push('/(seller)/products/add')}
          />
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: Colors.borderSubtle }} />
            )}
            renderItem={({ item }) => (
              <ProductRow
                product={item}
                onEdit={() => router.push(`/(seller)/products/${item.id}`)}
                onDelete={() => confirmDelete(item)}
              />
            )}
          />
        )}
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
  searchBar: { padding: Spacing[4], borderBottomWidth: 1, borderBottomColor: Colors.border },
  list: { paddingBottom: Spacing[10] },
  skeletonList: { padding: Spacing[4], gap: Spacing[4] },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.black,
  },
  productThumb: { width: 72, height: 88, backgroundColor: Colors.surface },
  productInfo: { flex: 1, gap: Spacing[1] },
  productBrand: { fontSize: 10, letterSpacing: 1 },
  productMeta: { flexDirection: 'row', gap: Spacing[2], marginTop: Spacing[0.5] },
  stockBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderWidth: 1,
  },
  stockBadgeOk: { borderColor: Colors.success },
  stockBadgeLow: { borderColor: Colors.error },
  inactiveBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.textMuted,
  },
  productActions: { gap: Spacing[2], alignItems: 'flex-end' },
  actionBtn: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

import { useCallback } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { useConfirm } from '@/providers/ConfirmProvider';
import { router, useFocusEffect } from 'expo-router';
import { CustomerHeader, CustomerScreen, EmptyState, ErrorView, Text } from '@/components/customer';
import { ProductGrid } from '@/components/customer/product/ProductGrid';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectWishlistItems, selectWishlistLoading } from '@/store/selectors/wishlist.selectors';
import { clearWishlistThunk, fetchWishlistThunk } from '@/store/slices/wishlist.slice';
import { CustomerLayout } from '@/theme/customer';

export default function WishlistScreen() {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const items = useAppSelector(selectWishlistItems);
  const isLoading = useAppSelector(selectWishlistLoading);
  const error = useAppSelector(state => state.wishlist.error);

  const confirmClear = async () => {
    const ok = await confirm({
      title: 'Clear wishlist',
      message: 'Remove every saved item?',
      confirmLabel: 'Clear all',
      destructive: true,
    });
    if (ok) dispatch(clearWishlistThunk());
  };

  // Rehydrate on focus: hearts toggled elsewhere only update the id set.
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchWishlistThunk());
    }, [dispatch]),
  );

  const header = (
    <CustomerHeader
      variant="back"
      title="Wishlist"
      right={
        items.length > 0 ? (
          <Pressable onPress={confirmClear} hitSlop={8} accessibilityRole="button">
            <Text variant="link">Clear all</Text>
          </Pressable>
        ) : undefined
      }
    />
  );
  const refresh = () => dispatch(fetchWishlistThunk());

  if (error && items.length === 0) {
    return (
      <CustomerScreen header={header} scroll={false}>
        <ErrorView message={error} onRetry={refresh} />
      </CustomerScreen>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <CustomerScreen header={header} scroll={false}>
        <EmptyState
          icon="heart"
          title="Your wishlist is empty"
          message="Save items you love and come back to them later."
          actionLabel="Shop now"
          onAction={() => router.push('/(customer)/(tabs)/explore')}
        />
      </CustomerScreen>
    );
  }

  return (
    <CustomerScreen
      header={header}
      refreshing={isLoading}
      onRefresh={refresh}
      contentContainerStyle={{ padding: CustomerLayout.screenPaddingH }}
    >
      <ProductGrid
        products={items}
        availableWidth={width}
        loading={isLoading && items.length === 0}
      />
    </CustomerScreen>
  );
}

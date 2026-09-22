import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  Chip,
  CustomerHeader,
  CustomerScreen,
  EmptyState,
  LoadMoreButton,
  SearchField,
} from '@/components/customer';
import { ActiveFilterChips } from '@/components/customer/collection/ActiveFilterChips';
import { CollectionToolbar } from '@/components/customer/collection/CollectionToolbar';
import { FilterSheet } from '@/components/customer/collection/FilterSheet';
import { SortSheet } from '@/components/customer/collection/SortSheet';
import { TRENDING_TAGS } from '@/components/customer/collection/constants';
import { ProductGrid } from '@/components/customer/product/ProductGrid';
import { useCollectionFilters } from '@/hooks/useCollectionFilters';
import { useResetOnTabPress } from '@/hooks/useResetOnTabPress';
import { useProductsInfinite } from '@/hooks/useProducts';
import { CustomerLayout } from '@/theme/customer';
import { Spacing } from '@/theme/spacing';

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const filters = useCollectionFilters();

  // Re-entering the tab gives a clean screen; returning from a product does not.
  useResetOnTabPress(filters.resetAll);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProductsInfinite(
    filters.queryParams,
  );

  const products = data?.pages.flatMap(page => page.products) ?? [];
  const total = data?.pages[0]?.total;

  return (
    <CustomerScreen header={<CustomerHeader variant="logo" />}>
      <View style={styles.searchSection}>
        <SearchField
          value={filters.searchText}
          onChangeText={filters.setSearchText}
          placeholder="Search eyewear"
        />
        <View style={styles.tags}>
          {TRENDING_TAGS.map(tag => (
            <Chip key={tag} label={tag} onPress={() => filters.setSearchText(tag)} />
          ))}
        </View>
      </View>

      <CollectionToolbar
        activeFilterCount={filters.activeFilterCount}
        sortLabel={filters.selectedSort?.label ?? 'Sort'}
        totalCount={total}
        onFilterPress={() => {
          filters.openFilter();
          setShowFilter(true);
        }}
        onSortPress={() => setShowSort(true)}
      />

      <ActiveFilterChips
        active={filters.activeFilters}
        groups={filters.filterGroups}
        onRemove={filters.removeFilter}
        onClearAll={filters.resetFilters}
      />

      {!isLoading && products.length === 0 ? (
        <EmptyState
          icon="search"
          title="No products found"
          message={
            filters.activeFilterCount > 0
              ? 'Try removing a filter or two.'
              : 'Try a different search term.'
          }
          variant="inline"
        />
      ) : (
        <View style={styles.gridWrap}>
          <ProductGrid
            products={products}
            availableWidth={width}
            loading={isLoading}
            skeletonCount={6}
          />
        </View>
      )}

      <LoadMoreButton
        onPress={() => fetchNextPage()}
        isLoading={isFetchingNextPage}
        hasMore={Boolean(hasNextPage) && products.length > 0}
      />

      <SortSheet
        visible={showSort}
        options={filters.sortOptions}
        value={filters.selectedSort}
        onChange={filters.setSelectedSort}
        onClose={() => setShowSort(false)}
      />

      <FilterSheet
        visible={showFilter}
        groups={filters.filterGroups}
        draft={filters.draftFilters}
        onToggle={filters.toggleDraftFilter}
        onApply={filters.applyFilters}
        onReset={filters.resetFilters}
        onClose={() => setShowFilter(false)}
      />
    </CustomerScreen>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    gap: Spacing[3],
    paddingHorizontal: CustomerLayout.screenPaddingH,
    paddingVertical: Spacing[4],
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  gridWrap: { paddingHorizontal: CustomerLayout.screenPaddingH, paddingTop: Spacing[4] },
});

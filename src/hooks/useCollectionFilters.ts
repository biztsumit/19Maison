import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SORT_OPTIONS } from '@/components/customer/collection/constants';
import type { SortOption } from '@/components/customer/collection/constants';
import { useProductFilters } from '@/hooks/useProducts';

// Any route param other than `search` is treated as a filter group id, because
// the navigation API supplies arbitrary filterParams (productType, shape, rimType,
// material, ...) rather than a fixed set.
export type CollectionSeedParams = Record<string, string | undefined> & {
  search?: string;
};

const NON_FILTER_PARAMS = new Set(['search', 'q']);

export type ActiveFilters = Record<string, string[]>;

// Home sends the API's uppercase gender, Category sends lowercase. The filter
// option values are lowercase, so normalise or seeded filters silently miss.
function seedFrom(params: CollectionSeedParams): ActiveFilters {
  const seeded: ActiveFilters = {};
  for (const [key, value] of Object.entries(params)) {
    if (!value || NON_FILTER_PARAMS.has(key)) continue;
    // Passed through verbatim. Casing is per-filter and the API validates it:
    // targetAudience/productType are upper-case enums, brand is a lower-case slug.
    // Normalising either way produces a 400.
    seeded[key] = [String(value)];
  }
  return seeded;
}

export function useCollectionFilters() {
  // typedRoutes makes the generic a route path, not a params shape.
  const params = useLocalSearchParams() as CollectionSeedParams;

  const [searchText, setSearchText] = useState(params.search ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState(params.search ?? '');
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => seedFrom(params));
  const [draftFilters, setDraftFilters] = useState<ActiveFilters>(() => seedFrom(params));

  // Explore is a tab screen and stays mounted, so lazy state initialisers alone
  // would pin it to whichever params it first saw. Re-seed when they change.
  const seedKey = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('|');
  const previousSeed = useRef(seedKey);

  useEffect(() => {
    if (seedKey === previousSeed.current) return;
    previousSeed.current = seedKey;
    const next = seedFrom(params);
    setActiveFilters(next);
    setDraftFilters(next);
    if (params.search !== undefined) {
      setSearchText(params.search);
      setDebouncedSearch(params.search);
    }
    // `params` is a fresh object each render; seedKey is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { data: apiFilterGroups = [] } = useProductFilters();
  // Only the API's own groups are offered. A hardcoded fallback would let the
  // user pick ids and values the backend does not accept.
  const filterGroups = apiFilterGroups;

  // The API keys filters by the group id it advertises in /products/filters, so
  // these pass through verbatim. Renaming them (brand -> brandSlugs) or listing
  // only a few groups silently dropped every other filter.
  const queryParams = useMemo(() => {
    const selected = Object.fromEntries(
      Object.entries(activeFilters).filter(([, values]) => values.length > 0),
    );
    return {
      limit: 20,
      ...selected,
      search: debouncedSearch || undefined,
      sortBy: selectedSort?.sortBy,
      sortOrder: selectedSort?.sortOrder,
    };
  }, [debouncedSearch, selectedSort, activeFilters]);

  const activeFilterCount = useMemo(
    () => Object.values(activeFilters).reduce((sum, values) => sum + values.length, 0),
    [activeFilters],
  );

  const openFilter = () => setDraftFilters({ ...activeFilters });

  const toggleDraftFilter = (groupId: string, value: string) =>
    setDraftFilters(prev => {
      const current = prev[groupId] ?? [];
      return {
        ...prev,
        [groupId]: current.includes(value) ? current.filter(v => v !== value) : [...current, value],
      };
    });

  const applyFilters = () => setActiveFilters({ ...draftFilters });

  const resetFilters = () => {
    setDraftFilters({});
    setActiveFilters({});
  };

  // Everything back to the route's baseline. Used when the user re-enters the tab.
  const resetAll = useCallback(() => {
    const seeded = seedFrom(params);
    setActiveFilters(seeded);
    setDraftFilters(seeded);
    setSearchText(params.search ?? '');
    setDebouncedSearch(params.search ?? '');
    setSelectedSort(null);
    // `params` is a fresh object each render; seedKey is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey]);

  const removeFilter = (groupId: string, value: string) =>
    setActiveFilters(prev => ({
      ...prev,
      [groupId]: (prev[groupId] ?? []).filter(v => v !== value),
    }));

  return {
    searchText,
    setSearchText,
    selectedSort,
    setSelectedSort,
    sortOptions: SORT_OPTIONS,
    filterGroups,
    activeFilters,
    draftFilters,
    activeFilterCount,
    queryParams,
    openFilter,
    toggleDraftFilter,
    applyFilters,
    resetFilters,
    resetAll,
    removeFilter,
  };
}

export interface SortOption {
  label: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Best selling', sortBy: 'totalQtySold', sortOrder: 'desc' },
  { label: 'Alphabetically A-Z', sortBy: 'name', sortOrder: 'asc' },
  { label: 'Alphabetically Z-A', sortBy: 'name', sortOrder: 'desc' },
  { label: 'Price High to Low', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Price Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Date Old to New', sortBy: 'createdAt', sortOrder: 'asc' },
  { label: 'Date New to Old', sortBy: 'createdAt', sortOrder: 'desc' },
];

export const TRENDING_TAGS = ['Aviator', 'Cartier', 'Capote'];

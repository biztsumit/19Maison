import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ProductService } from '@/api/services/product.service';
import type { ProductListParams } from '@/types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  latest: () => [...productKeys.all, 'latest'] as const,
  collectors: () => [...productKeys.all, 'collectors'] as const,
  reviews: (id: string) => [...productKeys.all, 'reviews', id] as const,
};

export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: ProductService.getFeatured,
  });
}

export function useLatestProducts() {
  return useQuery({
    queryKey: productKeys.latest(),
    queryFn: ProductService.getLatest,
  });
}

export function useCollectorsEdition() {
  return useQuery({
    queryKey: productKeys.collectors(),
    queryFn: ProductService.getCollectorsEdition,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ProductService.getProduct(id),
    enabled: !!id,
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: productKeys.reviews(productId),
    queryFn: () => ProductService.getReviews(productId),
    enabled: !!productId,
  });
}

export function useProductFilters() {
  return useQuery({
    queryKey: ['products', 'filters'],
    queryFn: ProductService.getFilters,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsInfinite(params: Omit<ProductListParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: productKeys.list(params),
    queryFn: ({ pageParam = 1 }) =>
      ProductService.getProducts({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return undefined;
    },
  });
}

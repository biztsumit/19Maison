import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '@/api/services/order.service';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/selectors/auth.selectors';
import type { OrderListParams } from '@/types/order.types';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrderListParams) => [...orderKeys.lists(), params] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

export function useOrders(params: OrderListParams = {}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => OrderService.getOrders(params),
    enabled: isAuthenticated,
    // Shorter than the product caches: order status changes server-side.
    staleTime: 60 * 1000,
    refetchOnMount: 'always',
  });
}

export function useOrder(id: string | undefined) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: orderKeys.detail(id ?? ''),
    queryFn: () => OrderService.getOrder(id as string),
    enabled: Boolean(id) && isAuthenticated,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => OrderService.cancelOrder(id),
    onSuccess: order => {
      queryClient.setQueryData(orderKeys.detail(order.id), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

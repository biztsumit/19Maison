import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddressService } from '@/api/services/profile.service';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/selectors/auth.selectors';
import type { AddressRequest } from '@/types/user.types';

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
  // Nested under `all` so an address mutation can refresh both in one call.
  addresses: () => [...profileKeys.all, 'addresses'] as const,
};

export function useAddresses() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: profileKeys.addresses(),
    queryFn: AddressService.getAddresses,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressRequest) => AddressService.createAddress(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressRequest }) =>
      AddressService.updateAddress(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AddressService.deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AddressService.setDefaultAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
}

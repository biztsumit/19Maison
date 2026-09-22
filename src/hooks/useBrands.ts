import { useQuery } from '@tanstack/react-query';
import { BrandService } from '@/api/services/brand.service';

export function useActiveBrands() {
  return useQuery({
    queryKey: ['brands', 'active'],
    queryFn: BrandService.getActiveBrands,
    // Brands change rarely.
    staleTime: 10 * 60 * 1000,
  });
}

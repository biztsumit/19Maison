import { useQuery } from '@tanstack/react-query';
import { HomepageService } from '@/api/services/homepage.service';

export function useHomepage() {
  return useQuery({
    queryKey: ['homepage'],
    queryFn: HomepageService.getHomepage,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLatestDrop() {
  return useQuery({
    queryKey: ['homepage', 'latestDrop'],
    queryFn: () => HomepageService.getLatestDrop({ limit: 8 }),
  });
}

export function useCollectorsEditionDrop() {
  return useQuery({
    queryKey: ['homepage', 'collectorsEdition'],
    queryFn: () => HomepageService.getLatestDrop({ limit: 8, isExclusive: true }),
  });
}

import { useQuery } from '@tanstack/react-query';
import { NavigationService } from '@/api/services/navigation.service';

export function useNavigation() {
  return useQuery({
    queryKey: ['navigation'],
    queryFn: NavigationService.getNavigation,
    staleTime: 10 * 60 * 1000, // 10 min — nav rarely changes
  });
}

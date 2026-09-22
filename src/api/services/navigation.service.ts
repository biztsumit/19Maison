import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type { ApiResponse } from '@/types';

// Each entry carries the filter values to apply, keyed by filter group id
// (e.g. { productType: 'SUNGLASSES' }). The web builds its collection hrefs
// straight from these, so they are the contract — there is no `slug`.
export type NavFilterParams = Record<string, string | boolean>;

export interface NavItem {
  label: string;
  filterParams: NavFilterParams;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavCategory {
  key: string;
  label: string;
  filterParams: NavFilterParams;
  sections: NavSection[];
}

export const NavigationService = {
  async getNavigation(): Promise<NavCategory[]> {
    const res = await apiClient.get<ApiResponse<NavCategory[]>>(Endpoints.navigation);
    const items = res.data.data;
    return Array.isArray(items) ? items : [];
  },
};

// Filter params become route params verbatim, so the collection screen can seed
// its filters from them without knowing which groups exist.
export const toFilterRouteParams = (params: NavFilterParams): Record<string, string> =>
  Object.fromEntries(Object.entries(params ?? {}).map(([k, v]) => [k, String(v)]));

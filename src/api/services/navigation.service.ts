import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';

export interface NavItem {
  label: string;
  slug: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavCategory {
  key: string;
  label: string;
  sections: NavSection[];
}

export const NavigationService = {
  async getNavigation(): Promise<NavCategory[]> {
    const res = await apiClient.get<{ data: NavCategory[] }>(Endpoints.navigation);
    return res.data.data ?? [];
  },
};

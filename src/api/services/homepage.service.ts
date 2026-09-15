import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type {
  HomepageData,
  HomepageResponse,
  HomepageProductItem,
  LatestDropResponse,
} from '@/types/homepage.types';

export const HomepageService = {
  async getHomepage(): Promise<HomepageData> {
    const res = await apiClient.get<HomepageResponse>(Endpoints.homepage);
    return res.data.data;
  },

  async getLatestDrop(params?: {
    limit?: number;
    isExclusive?: boolean;
  }): Promise<HomepageProductItem[]> {
    const res = await apiClient.get<LatestDropResponse>(Endpoints.products.latestDrop, { params });
    return res.data.data ?? [];
  },
};

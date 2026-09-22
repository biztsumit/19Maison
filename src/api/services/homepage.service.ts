import { Endpoints } from '@/constants/api';
import type {
  HomepageData,
  HomepageProductItem,
  HomepageResponse,
  LatestDropResponse,
} from '@/types/homepage.types';
import { apiClient } from '../client';

export const HomepageService = {
  async getHomepage(): Promise<HomepageData> {
    const res = await apiClient.get<HomepageResponse>(Endpoints.homepage);
    console.log('homepage>>.>>>11>', res.data);
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

import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type { ApiResponse } from '@/types';
import type { BrandItem } from '@/types/homepage.types';

export const BrandService = {
  // GET /brands/active → BrandItem[] (nested image: { documentId, imageUrl })
  async getActiveBrands(): Promise<BrandItem[]> {
    const res = await apiClient.get<ApiResponse<BrandItem[]>>(Endpoints.brands.active);
    return res.data.data ?? [];
  },
};

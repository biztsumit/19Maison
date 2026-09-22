import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type { Address, AddressRequest, CustomerProfile } from '@/types/user.types';
import type { ApiResponse } from '@/types';

export const ProfileService = {
  async getProfile(): Promise<CustomerProfile> {
    const res = await apiClient.get<ApiResponse<CustomerProfile>>(Endpoints.profile.get);
    return res.data.data;
  },
};

// Addresses live under their own top-level resource, matching the web client.
export const AddressService = {
  async getAddresses(): Promise<Address[]> {
    const res = await apiClient.get<ApiResponse<Address[]>>(Endpoints.addresses.list);
    return res.data.data ?? [];
  },

  async createAddress(data: AddressRequest): Promise<Address> {
    const res = await apiClient.post<ApiResponse<Address>>(Endpoints.addresses.create, data);
    return res.data.data;
  },

  async updateAddress(id: string, data: AddressRequest): Promise<Address> {
    const res = await apiClient.patch<ApiResponse<Address>>(Endpoints.addresses.detail(id), data);
    return res.data.data;
  },

  async deleteAddress(id: string): Promise<void> {
    await apiClient.delete(Endpoints.addresses.detail(id));
  },

  async setDefaultAddress(id: string): Promise<void> {
    await apiClient.patch(Endpoints.addresses.setDefault(id));
  },
};

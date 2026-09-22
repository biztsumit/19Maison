// Mirrors the shape the web storefront posts to /addresses, which is the
// implementation currently in production. `state` and `country` are full names
// (e.g. "Maharashtra", "India"), not ISO codes.
export interface Address {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  // Addresses are fetched separately via /addresses.
  addresses?: Address[];
  wishlistCount: number;
  orderCount: number;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
}

export type AddressRequest = Omit<Address, 'id' | 'userId' | 'isDefault'> & {
  isDefault?: boolean;
};

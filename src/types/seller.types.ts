export interface SellerStore {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  totalProducts: number;
  totalOrders: number;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  store: SellerStore;
  totalEarnings: number;
  pendingEarnings: number;
  withdrawnEarnings: number;
  createdAt: string;
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  revenueByDay: DailyRevenue[];
  topProducts: TopProduct[];
  ordersByStatus: OrderStatusCount[];
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  image: string;
  totalSales: number;
  revenue: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  variantId: string;
  color: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export interface UpdateStoreRequest {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
}

export interface SellerState {
  profile: SellerProfile | null;
  analytics: SalesAnalytics | null;
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
}

export type NotificationType =
  | 'order_update'
  | 'promotion'
  | 'wishlist'
  | 'review'
  | 'system'
  | 'payment';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  pushToken: string | null;
  isLoading: boolean;
}

export interface NotificationData {
  notifId: number;
  productId: number | null;
  isRead: boolean;
  title: string;
  message: string;
  image?: string;
}

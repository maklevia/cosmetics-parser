export interface NotificationDataResponse {
  notifId: number;
  productId: number | null;
  isRead: boolean;
  title: string;
  message: string;
  image?: string;
}

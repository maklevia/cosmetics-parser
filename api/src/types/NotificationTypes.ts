import { StoreName } from "./Enums.js";

export interface NotificationData {
  notifId: number;
  productId: number | null;
  isRead: boolean;
  title: string;
  message: string;
  image?: string;
}

export interface PriceDropDInfo {
  queueId: number;
  productName: string;
  productId: number;
  storeName: StoreName;
  productLink: string;
  image?: string;
  oldPrice: number;
  newPrice: number;
}

export interface PendingNotifData {
  userId: number;
  telegramAccountId: number;
  priceDropsData: PriceDropDInfo[];
}

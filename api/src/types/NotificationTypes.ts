import { StoreName } from "./Enums.js";

export interface NotificationDataResponse {
  notifId: number;
  productId: number | null;
  isRead: boolean;
  title: string;
  message: string;
  image?: string;
}

export interface PriceDropInfo {
  queueId: number;
  productName: string;
  productId: number;
  storeName: StoreName;
  productLink: string;
  image?: string;
  oldPrice: number;
  newPrice: number;
}

export interface PendingNotifDataRow {
  userId: number;
  telegramAccountId: number;
  priceDropsData: PriceDropInfo[];
}

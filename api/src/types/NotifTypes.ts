import { StoreName } from "@api/types/StoreName.js";

export interface PendingNotifDataRow {
  userId: number;
  telegramId: number;
  priceDropsData: {
    queueId: number;
    productId: number;
    productName: string;
    storeName: StoreName;
    productLink: string;
    oldPrice: number;
    newPrice: number;
    image?: string;
  }[];
}

export interface NotificationRow {
    notifId: number,
    productId: number,
    image?: string,
    title: string,
    message: string,
    isRead: boolean
}
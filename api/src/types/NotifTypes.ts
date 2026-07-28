import { StoreName } from "./StoreName.js";

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

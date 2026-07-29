import { StoreName } from "@api/types/Enums.js";

export interface PriceDropItem {
  name: string;
  oldPrice?: number;
  newPrice?: number;
  image?: string;
  link: string;
  storeName: StoreName;
}

export interface BaseGateway {
    sendPriceDropNotification(channelAccountId: number, item: PriceDropItem): Promise<void>;
    generateBindingLink(userUuid: string): string;
}

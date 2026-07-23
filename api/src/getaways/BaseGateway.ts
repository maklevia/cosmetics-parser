export interface PriceDropItem {
  name: string;
  oldPrice?: number;
  newPrice?: number;
  image?: string;
  link: string
}

export interface BaseGateway {
    sendPriceDropNotification(channelAccountId: number, item: PriceDropItem): Promise<void>;
    generateBindingLink(userUuid: string): string;
}

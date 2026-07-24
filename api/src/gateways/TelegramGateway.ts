import { ChannelNotificationError } from "@api/errors/ChannelErrors.js";
import { BaseGateway, PriceDropItem } from "@api/gateways/BaseGateway.js";
import { formatStoreName } from "@api/utils/formatStoreName.js";
import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";

export class TelegramGateway implements BaseGateway {
  private readonly telegramApiUrl: string;

  constructor() {
    const token = getEnvOrThrow("TELEGRAM_BOT_TOKEN");
    this.telegramApiUrl = `https://api.telegram.org/bot${token}`;
  }

  generateBindingLink(userUuid: string): string {
    return `${getEnvOrThrow("TELEGRAM_BOT_LINK")}?start=${userUuid}`;
  }

  async sendPriceDropNotification(
    channelAccountId: number,
    item: PriceDropItem,
  ): Promise<void> {
    const message =
      `🚨 <b>Price Drop Alert!</b>\n\n` +
      `💄 <b>${item.name}</b>\n` +
      `📉 Price: <s>${item.oldPrice} UAH</s> ➡️ <b>${item.newPrice} UAH on ${formatStoreName(item.storeName)}</b>\n\n` +
      `<i><a href="${item.link}">Tap here to view the product</a></i>`;

      try {
        if (item.image) {
            await this.sendPhoto(channelAccountId, message, item.image);
        } else {
            await this.sendMessage(channelAccountId, message);
        }
      } catch (error) {
        throw error;
      }
  }

    private async sendMessage(telegramAccountId: number, message: string) {
    const url = `${this.telegramApiUrl}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramAccountId,
        text: message,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ChannelNotificationError();
    }
  }

  private async sendPhoto(telegramAccountId: number, message: string, imageUrl: string) {
    const url = `${this.telegramApiUrl}/sendPhoto`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramAccountId,
        photo: imageUrl,
        caption: message,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ChannelNotificationError();
    }
  }
}

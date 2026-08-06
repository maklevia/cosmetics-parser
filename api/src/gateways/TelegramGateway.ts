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
    batchId: string,
  ): Promise<void> {
    const message =
      `🚨 <b>Price Drop Alert!</b>\n\n` +
      `💄 <b>${item.name}</b>\n` +
      `📉 Price: <s>${item.oldPrice} UAH</s> ➡️ <b>${item.newPrice} UAH on ${formatStoreName(item.storeName)}</b>\n\n` +
      `<i><a href="${item.link}">Tap here to view the product</a></i>`;

    const markup = {
      inline_keyboard: [[{ text: "See products 💄", callback_data: `pd:${batchId}:0` }]]
    };

    if (item.image) {
      await this.sendPhoto(channelAccountId, message, item.image, markup);
    } else {
      await this.sendMessage(channelAccountId, message, markup);
    }
  }

  async sendPriceDropSummary(
    channelAccountId: number,
    count: number,
    batchId: string,
  ): Promise<void> {
    const message = `🚨 <b>Price Drop Alert!</b>\n\n<b>` + 
    `${count} products</b> from your collection are now available for a lower price!`;

    await this.sendMessage(channelAccountId, message, {
      inline_keyboard: [[{ text: "See products 💄", callback_data: `pd:${batchId}:0` }]]
    });
  }

  private async sendMessage(telegramAccountId: number, message: string, markup?: any) {
    const url = `${this.telegramApiUrl}/sendMessage`;

    const body: any = {
      chat_id: telegramAccountId,
      text: message,
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    };

    if (markup) {
      body.reply_markup = markup;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new ChannelNotificationError();
    }
  }

  private async sendPhoto(
    telegramAccountId: number,
    message: string,
    imageUrl: string,
    markup?: any,
  ) {
    const url = `${this.telegramApiUrl}/sendPhoto`;

    const body: any = {
      chat_id: telegramAccountId,
      photo: imageUrl,
      caption: message,
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    };

    if (markup) {
      body.reply_markup = markup;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ChannelNotificationError();
    }
  }
}

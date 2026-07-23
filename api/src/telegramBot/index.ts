import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";

export class TelegramBot {
  private readonly botToken: string;
  private readonly baseUrl: string;
  constructor() {
    const token = getEnvOrThrow("TELEGRAM_BOT_TOKEN");

    this.botToken = token;
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendTelegramMessage(telegramId: number, messageText: string) {
    const url = `${this.baseUrl}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramId,
        text: messageText,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Telegram API error: ${error.description}`);
    }
  }
}

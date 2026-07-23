import { NotificationRepositories } from "@api/repositories/notificationRepositories.js";
import { TelegramBot } from "@api/telegramBot/index.js";
import { StoreName } from "@api/types/StoreName.js";

const notifRepositories = new NotificationRepositories();
const telegramBot = new TelegramBot();

export default class CronNotifServices {
  async sendNotifications() {
    try {
      console.log('Starting to send notifications')
      const notifData = await notifRepositories.getPendingNotificationsData();
      console.log(notifData);
      const processedQueueIds: number[] = [];

      for (const user of notifData) {
        let telegramMessage: string = `🚨 Price Drop Alerts 🚨\n`;

        for (const priceDropData of user.priceDropsData) {
          if (user.telegramId) {
            telegramMessage += this.getTelegramMessage(
            priceDropData.productName,
            priceDropData.oldPrice,
            priceDropData.newPrice,
            priceDropData.productLink,
            priceDropData.storeName
          );
          }

          const title: string = "🚨 Price Drop";
          const message = this.getNotifMessage(
            priceDropData.productName,
            priceDropData.oldPrice,
            priceDropData.newPrice,
          );

          await notifRepositories.createUserNotification(
            user.userId,
            priceDropData.productId,
            title,
            message,
            priceDropData.image,
          );

          processedQueueIds.push(priceDropData.queueId);
        }

        if (user.telegramId) {
          try {
            await telegramBot.sendTelegramMessage(user.telegramId, telegramMessage);
          } catch (error) {
            console.error(`Failed to send telegram message to user ${user.userId}:`, error);
          }
        }
      }
      
      await notifRepositories.updatePriceDropQueue(processedQueueIds);
      console.log('Finished to send notifications')
    } catch (error) {
      console.log("API: CronNotifServices error: ", error);
    }
  }

  private getTelegramMessage(
    productName: string,
    oldPrice: number,
    newPrice: number,
    link: string,
    storeName: StoreName,
  ) {
    const priceInfo = this.getNotifMessage(productName, oldPrice, newPrice);
    return priceInfo + ` (${storeName})\n${link}`;
  }

  private getNotifMessage(
    productName: string,
    oldPrice: number,
    newPrice: number,
  ): string {
    return `${productName}: ${oldPrice} -> ${newPrice}`;
  }

  async clearOldRecords() {
    try {
        await notifRepositories.clearOldRecords();
    } catch (error) {
        console.log('API Cron: Error clearing up old db records (price queue and notifications)');
    }
  }
}

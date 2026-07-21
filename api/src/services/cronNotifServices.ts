import { NotificationRepositories } from "@api/repositories/notificationRepositories.js";
import { StoreName } from "@api/types/StoreName.js";

const notifRepositories = new NotificationRepositories();

export class CronNotifServices {
  async sendNotifications() {
    try {
      const notifData = await notifRepositories.getPendingNotificationsData();
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

          //send tg message here: when implemented

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
      }
      await notifRepositories.updatePriceDropQueue(processedQueueIds);
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

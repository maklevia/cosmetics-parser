import { NotificationRepositories } from "@api/repositories/notificationRepositories.js";
import { getAllGateways } from "@api/getaways/getGetaway.js";

const notifRepositories = new NotificationRepositories();
const gateways = getAllGateways();

export class CronNotifServices {
  async sendNotifications() {
    try {
      console.log('Starting to send notifications')
      const notifData = await notifRepositories.getPendingNotificationsData();
      const processedQueueIds: number[] = [];

      for (const user of notifData) {
        const channelAccountIds: Record<string, number | null> = {
          telegram: user.telegramId,
        };

        //create notification in db for web app
        for (const priceDropData of user.priceDropsData) {
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

          //send notification through all connected gateways
          for (const [channelName, gateway] of gateways) {
            const accountId = channelAccountIds[channelName];
            if (accountId) {
              try {
                await gateway.sendPriceDropNotification(accountId, {
                  name: priceDropData.productName,
                  oldPrice: priceDropData.oldPrice,
                  newPrice: priceDropData.newPrice,
                  link: priceDropData.productLink,
                  image: priceDropData.image,
                });
              } catch (error) {
                console.error(`Failed to send ${channelName} notification to user ${user.userId}:`, error);
              }
            }
          }
        }
      }
      
      await notifRepositories.updatePriceDropQueue(processedQueueIds);
      console.log('Finished to send notifications')
    } catch (error) {
      console.log("API: CronNotifServices error: ", error);
    }
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

import { NotificationRepositories } from "@api/repositories/notificationRepositories.js";
import { getAllGateways } from "@api/getaways/getGetaway.js";
import { ChannelNotificationError } from "@api/errors/ChannelErrors.js";
import { ChannelRepositories } from "@api/repositories/channelRepositories.js";

const notifRepositories = new NotificationRepositories();
const channelRepositories = new ChannelRepositories();
const gateways = getAllGateways();

export class CronNotifServices {
  async sendNotifications() {
    try {
      console.log("Starting to send notifications");
      const notifData = await notifRepositories.getPendingNotificationsData();
      const processedQueueIds: number[] = [];

      for (const user of notifData) {
        const channelAccountIds: Record<string, number | null> = {
          telegram: user.telegramId,
        };

        const failedChannels = new Set<string>(); 
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
            title,
            message,
            priceDropData.productId,
            priceDropData?.image,
          );

          processedQueueIds.push(priceDropData.queueId);

          //send notification through all connected gateways
          for (const [channelName, gateway] of gateways) {
            const accountId = channelAccountIds[channelName];

            if (!accountId || failedChannels.has(channelName)) continue; 

            if (accountId) {
              try {
                await gateway.sendPriceDropNotification(accountId, {
                  name: priceDropData.productName,
                  oldPrice: priceDropData.oldPrice,
                  newPrice: priceDropData.newPrice,
                  link: priceDropData.productLink,
                  image: priceDropData.image,
                  storeName: priceDropData.storeName,
                });
              } catch (error) {
                if (error instanceof ChannelNotificationError) {
                  failedChannels.add(channelName)
                  await channelRepositories.disconnectChannelAccount(
                    user.userId,
                    channelName,
                  );

                  await notifRepositories.createUserNotification(
                    user.userId,
                    "⚠️ Telegram Disconnected",
                    "Your Telegram bot was disconnected. Reconnect anytime from your profile.",
                  );
                }

                console.error(
                  `Failed to send ${channelName} notification to user ${user.userId}:`,
                );
              }
            }
          }
        }
      }

      await notifRepositories.updatePriceDropQueue(processedQueueIds);
      console.log("Finished to send notifications");
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
      console.log(
        "API Cron: Error clearing up old db records (price queue and notifications)",
      );
    }
  }
}

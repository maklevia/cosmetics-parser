import { NotificationRepository } from "@api/repositories/notificationRepository.js";
import { getAllGateways } from "@api/gateways/getGetaway.js";
import { ChannelNotificationError } from "@api/errors/ChannelErrors.js";
import { ChannelName } from "@api/types/Enums.js";
import { ChannelRepository } from "@api/repositories/channelRepository.js";

const notifRepositories = new NotificationRepository();
const channelRepository = new ChannelRepository();
const gateways = getAllGateways();

export class CronNotifService {
  async sendNotifications(): Promise<void> {
    try {
      console.log("Starting to send notifications");
      const notifData = await notifRepositories.getPendingNotificationsData();
      const processedQueueIds: number[] = [];

      for (const user of notifData) {
        const channelAccountIds: Partial<Record<ChannelName, number | null>> = {
          [ChannelName.Telegram]: user.telegramAccountId,
        };

        const failedChannels = new Set<ChannelName>(); 
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
                  await channelRepository.disconnectChannelAccount(
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
      console.log("API: CronNotifService error: ", error);
    }
  }

  private getNotifMessage(
    productName: string,
    oldPrice: number,
    newPrice: number,
  ): string {
    return `${productName}: ${oldPrice} -> ${newPrice}`;
  }

  async clearOldRecords(): Promise<void> {
    try {
      await notifRepositories.clearOldRecords();
    } catch (error) {
      console.log(
        "API Cron: Error clearing up old db records (price queue and notifications)",
      );
    }
  }
}

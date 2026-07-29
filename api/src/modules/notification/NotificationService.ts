import { NotificationRepository } from "@api/modules/notification/NotificationRepository.js";
import { NotificationData } from "@api/types/NotificationTypes.js";

const notifRepositories = new NotificationRepository();

export class NotificationService {
  async getUsersNotifications(userId: number): Promise<NotificationData[]> {
    const userNotifications =
      await notifRepositories.getNotificationsByUserId(userId);
    return userNotifications.map((notif) => ({
      notifId: notif.id,
      productId: notif.product?.id ?? null,
      isRead: notif.isRead,
      title: notif.title ?? "",
      message: notif.message,
      image: notif.image ?? undefined,
    }));
  }

  async markNotifAsRead(notifId: number): Promise<void> {
    await notifRepositories.markNotifAsRead(notifId);
  }
}

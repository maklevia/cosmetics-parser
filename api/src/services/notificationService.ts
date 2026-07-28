import { UserNotification } from "@api/entities/UserNotification.js";
import { NotificationRepository } from "@api/repositories/notificationRepository.js"
import { NotificationDataResponse } from "@api/types/NotificationDataResponse.js";

const notifRepositories = new NotificationRepository();

export class NotificationServices {
    async getUsersNotifications(userId: number): Promise<NotificationDataResponse[]> {
        try {
            const userNotifications = await notifRepositories.getNotificationsByUserId(userId);
            return userNotifications.map(notif => ({
                notifId: notif.id,
                productId: notif.product?.id ?? null,
                isRead: notif.isRead,
                title: notif.title ?? "",
                message: notif.message,
                image: notif.image ?? undefined
            }));
        } catch (error) {
            throw error;
        }
    }

    async markNotifAsRead(notifId: number): Promise<void> {
        try {
            await notifRepositories.markNotifAsRead(notifId);
        } catch (error) {
            throw error;
        }
    }
}

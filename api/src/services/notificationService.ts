import { NotificationRepository } from "@api/repositories/notificationRepository.js"
import { NotificationRow } from "@api/types/NotifTypes.js";

const notifRepositories = new NotificationRepository();

export class NotificationServices {
    async getUsersNotifications(userId: number): Promise<NotificationRow[]> {
        try {
            const userNotifications = await notifRepositories.getNotificationsByUserId(userId);
            return userNotifications;
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

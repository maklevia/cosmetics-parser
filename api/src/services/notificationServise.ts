import { NotificationRepositories } from "@api/repositories/notificationRepositories.js"

const notifRepositories = new NotificationRepositories();

export class NotificationServices {
    async getUsersNotifications(userId: number) {
        try {
            const userNotifications = await notifRepositories.getNotificationsByUserId(userId);
            return userNotifications;
        } catch (error) {
            throw error;
        }
    }

    async markNotifAsRead(notifId: number) {
        try {
            await notifRepositories.markNotifAsRead(notifId);
        } catch (error) {
            throw error;
        }
    }
}

import { NotificationRepositories } from "@api/repositories/notificationRepositories.js"

const notifRepositories = new NotificationRepositories();

export class NotificationServices {
    async getUsersNotifications(userId: number) {
        try {
            const userNotifications = await notifRepositories.getNotificationsByUserId(userId);
            if (userNotifications.length === 0) {
                return null;
            }
            return userNotifications;
        } catch (error) {
            throw error;
        }
    }
}

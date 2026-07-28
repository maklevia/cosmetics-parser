import { NotificationService } from "@api/services/NotificationService.js";
import { getAuthUser } from "@api/middlewares/authMiddleware.js";
import { Request, Response } from "express";

const notificationService = new NotificationService();

export class NotificationController {
    getUserNotification = async (req: Request, res: Response) => {
        try {
            const userId = getAuthUser(res).userId;

            const userNotifications = await notificationService.getUsersNotifications(userId);
            res.status(200).json({notifications: userNotifications});
        } catch {
            res.status(400).json({error: 'Something went wrong.'});
        }
    }

    markNotifAsRead = async (req: Request, res: Response) => {
        try {
            const notifId = parseInt(req.params.notifId, 10);
            await notificationService.markNotifAsRead(notifId);
            res.status(200).json({message: 'Notification marked as read'});
        } catch (error) {
            res.status(400).json({error: 'Something went wrong.'});
        }
    }
}
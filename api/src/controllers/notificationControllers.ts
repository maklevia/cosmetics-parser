import { NotificationServices } from "@api/services/notificationServise.js";
import { Request, Response } from "express";

const notificationServices = new NotificationServices

export class NotificationControllers {
    getUserNotification = async (req: Request, res: Response) => {
        try {
            const userId = res.locals.user.userId;

            const userNotifications = await notificationServices.getUsersNotifications(userId);
            res.status(200).json({notifications: userNotifications});
        } catch {
            res.status(400).json({error: 'Something went wrong.'});
        }
    }

    markNotifAsRead = async (req: Request, res: Response) => {
        try {
            const notifId = parseInt(req.params.notifId, 10);
            await notificationServices.markNotifAsRead(notifId);
            res.status(200).json({message: 'Norification marked as read'});
        } catch (error) {
            res.status(400).json({error: 'Something went wrong.'});
        }
    }
}
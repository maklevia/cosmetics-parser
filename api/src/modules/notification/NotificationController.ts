import { NotificationService } from "@api/modules/notification/NotificationService.js";
import { getAuthUser } from "@api/middlewares/authMiddleware.js";
import { Request, Response } from "express";
import { ValidationError } from "@api/errors/AppError.js";

const notificationService = new NotificationService();

export class NotificationController {
  getUserNotification = async (req: Request, res: Response) => {
    const userId = getAuthUser(res).userId;

    const userNotifications =
      await notificationService.getUsersNotifications(userId);
    res.status(200).json({ notifications: userNotifications });
  };

  markNotifAsRead = async (req: Request, res: Response) => {
    const notifId = parseInt(req.params.notifId, 10);

    if (isNaN(notifId)) {
        throw new ValidationError('Invalid notification ID')
    }

    await notificationService.markNotifAsRead(notifId);
    res.status(200).json({ message: "Notification marked as read" });
  };
}

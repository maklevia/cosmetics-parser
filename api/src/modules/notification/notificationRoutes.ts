import { NotificationController } from "@api/modules/notification/NotificationController.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const notificationRoutes = Router();

const notificationController = new NotificationController();

notificationRoutes.get('/getAll', authMiddleware, notificationController.getUserNotification);
notificationRoutes.patch('/markAllAsRead', authMiddleware, notificationController.markAllAsRead);
notificationRoutes.patch('/:notifId/markAsRead', authMiddleware, notificationController.markNotifAsRead);

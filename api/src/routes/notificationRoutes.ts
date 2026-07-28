import { NotificationController } from "@api/controllers/NotificationController.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const notificationRoutes = Router();

const notificationController = new NotificationController();

notificationRoutes.get('/getAll', authMiddleware, notificationController.getUserNotification);
notificationRoutes.patch('/:notifId/markAsRead', authMiddleware, notificationController.markNotifAsRead);

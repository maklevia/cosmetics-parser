import { NotificationControllers } from "@api/controllers/notificationControllers.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { Router } from "express";

export const notificationRoutes = Router();

const notificationControllers = new NotificationControllers();

notificationRoutes.get('/getAll', authMiddleware, notificationControllers.getUserNotification);
notificationRoutes.patch('/:notifId/markAsRead', authMiddleware, notificationControllers.markNotifAsRead);

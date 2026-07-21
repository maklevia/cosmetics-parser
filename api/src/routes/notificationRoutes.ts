import { NotificationControllers } from "@api/controllers/notificationControllers.js";
import { Router } from "express";

export const notificationRoutes = Router();

const notificationControllers = new NotificationControllers();

notificationRoutes.get('/getAll', notificationControllers.getUserNotification);

import { Router } from "express";
import { AuthController } from "@api/modules/auth/AuthController.js";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";

export const authRoutes = Router();

const authController = new AuthController();

authRoutes.post('/login', authController.login);
authRoutes.post('/signup', authController.signup);
authRoutes.post('/refresh', authController.refresh);
authRoutes.post('/logout',authMiddleware, authController.logout);
authRoutes.patch('/resetPassword', authMiddleware, authController.resetPassword);

